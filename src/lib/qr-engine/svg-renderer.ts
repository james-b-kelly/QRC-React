import type {
  ColorConfig,
  ErrorCorrectionLevel,
  GradientConfig,
  QRMatrix,
  QROptions,
} from './types'
import { generateMatrix, isInFinderPattern } from './matrix'
import { renderDot } from './dots'
import { renderCornerDot, renderCornerSquare } from './corners'
import { computeFrameLayout } from './frames'

export function renderSVG(options: QROptions): { svg: string; matrix: QRMatrix; effectiveECL: ErrorCorrectionLevel } {
  const dotStyle = options.dotStyle ?? 'square'
  const margin = options.margin ?? 2
  const size = options.size ?? 300

  // Determine effective error correction level (may bump for logo)
  let ecl = options.errorCorrectionLevel ?? 'M'
  if (options.logo) {
    const logoRatio = options.logo.sizeRatio ?? 0.25
    if (logoRatio > 0.1 && ecl !== 'H') ecl = 'H'
    else if (logoRatio > 0.05 && (ecl === 'L' || ecl === 'M')) ecl = 'Q'
    else if (ecl === 'L' || ecl === 'M') ecl = 'Q'
  }

  const matrix = generateMatrix(options.data, ecl)
  const totalModules = matrix.size + margin * 2
  const moduleSize = size / totalModules

  const defs: string[] = []
  const uid = Math.random().toString(36).slice(2, 8)
  let gradientId = 0

  // Build foreground color/gradient
  const fgColor = options.foregroundColor ?? { type: 'solid', color: '#000000' }
  const fgFill = resolveColor(fgColor, `fg-${uid}-${gradientId++}`, defs, size)

  // Build corner colors
  const cornerOpts = options.cornerOptions ?? {}
  const cornerSquareColor = cornerOpts.squareColor ?? fgColor
  const cornerDotColor = cornerOpts.dotColor ?? fgColor
  const cornerSquareFill = resolveColor(cornerSquareColor, `cs-${uid}-${gradientId++}`, defs, size)
  const cornerDotFill = resolveColor(cornerDotColor, `cd-${uid}-${gradientId++}`, defs, size)

  // Background
  const bgColor = options.backgroundColor ?? { type: 'solid', color: '#FFFFFF' }
  let bgRect = ''
  if (bgColor.type === 'solid' && bgColor.color === 'transparent') {
    // No background
  } else {
    const bgFill = resolveColor(bgColor, `bg-${uid}-${gradientId++}`, defs, size)
    bgRect = `<rect x="0" y="0" width="${size}" height="${size}" fill="${bgFill}"/>`
  }

  // Logo: compute cleared area and image position together
  const logoClearSet = new Set<string>()
  let logoImageModules = 0
  let logoClearStart = 0
  let logoClearSize = 0
  if (options.logo) {
    const logoRatio = Math.min(options.logo.sizeRatio ?? 0.25, 0.35)
    const logoPadding = options.logo.padding ?? 1
    logoImageModules = Math.ceil(matrix.size * logoRatio)
    logoClearSize = Math.min(logoImageModules + logoPadding * 2, Math.floor(matrix.size * 0.39))
    // Centre the cleared area using round to split the remainder evenly
    logoClearStart = Math.round((matrix.size - logoClearSize) / 2)
    const logoEnd = logoClearStart + logoClearSize
    for (let r = logoClearStart; r < logoEnd; r++) {
      for (let c = logoClearStart; c < logoEnd; c++) {
        logoClearSet.add(`${r},${c}`)
      }
    }
  }

  // Render data dots (skip finder patterns and logo area)
  const dotPaths: string[] = []
  for (let row = 0; row < matrix.size; row++) {
    for (let col = 0; col < matrix.size; col++) {
      if (!matrix.modules[row][col]) continue
      if (isInFinderPattern(row, col, matrix.size)) continue
      if (logoClearSet.has(`${row},${col}`)) continue

      const x = (col + margin) * moduleSize
      const y = (row + margin) * moduleSize
      dotPaths.push(renderDot(dotStyle, x, y, moduleSize))
    }
  }

  // Render corner patterns
  const cornerSquareStyle = cornerOpts.squareStyle ?? 'square'
  const cornerDotStyle = cornerOpts.dotStyle ?? 'square'
  const cornerSquarePaths: string[] = []
  const cornerDotPaths: string[] = []
  const finderSize = 7 * moduleSize
  const innerDotSize = 3 * moduleSize

  for (const fp of matrix.finderPatterns) {
    const x = (fp.col + margin) * moduleSize
    const y = (fp.row + margin) * moduleSize

    cornerSquarePaths.push(renderCornerSquare(cornerSquareStyle, x, y, finderSize))

    // Inner dot is centered: offset by 2 modules from finder pattern start
    const dotX = x + 2 * moduleSize
    const dotY = y + 2 * moduleSize
    cornerDotPaths.push(renderCornerDot(cornerDotStyle, dotX, dotY, innerDotSize))
  }

  // Logo element — centred within the cleared area
  let logoElement = ''
  if (options.logo) {
    const logoSize = logoImageModules * moduleSize
    // Centre the image within the cleared area
    const clearPixelStart = (logoClearStart + margin) * moduleSize
    const clearPixelSize = logoClearSize * moduleSize
    const logoX = clearPixelStart + (clearPixelSize - logoSize) / 2
    const logoY = logoX
    logoElement = `<image href="${options.logo.src}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid slice"/>`
  }

  // Assemble SVG
  const defsBlock = defs.length > 0 ? `<defs>${defs.join('')}</defs>` : ''

  const qrContent = [
    bgRect,
    dotPaths.length > 0 ? `<path d="${dotPaths.join('')}" fill="${fgFill}"/>` : '',
    cornerSquarePaths.length > 0 ? `<path d="${cornerSquarePaths.join('')}" fill="${cornerSquareFill}" fill-rule="evenodd"/>` : '',
    cornerDotPaths.length > 0 ? `<path d="${cornerDotPaths.join('')}" fill="${cornerDotFill}"/>` : '',
    logoElement,
  ].join('')

  // Frame support
  const frame = options.frame
  const hasFrame = frame && frame.style !== 'none'

  if (hasFrame) {
    const resolvedFgColor = fgColor.type === 'solid' ? (fgColor.color ?? '#000000') : '#000000'
    const layout = computeFrameLayout(size, frame, resolvedFgColor)

    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${layout.totalWidth} ${layout.totalHeight}" width="${layout.totalWidth}" height="${layout.totalHeight}">`,
      layout.backgroundElements,
      `<g transform="translate(${layout.qrOffsetX},${layout.qrOffsetY})">`,
      defsBlock,
      qrContent,
      '</g>',
      layout.foregroundElements,
      '</svg>',
    ].join('')

    return { svg, matrix, effectiveECL: ecl }
  }

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`,
    defsBlock,
    qrContent,
    '</svg>',
  ].join('')

  return { svg, matrix, effectiveECL: ecl }
}

function resolveColor(
  config: ColorConfig,
  gradientId: string,
  defs: string[],
  svgSize: number,
): string {
  if (config.type === 'solid') {
    return config.color ?? '#000000'
  }

  if (config.gradient) {
    defs.push(renderGradientDef(config.gradient, gradientId, svgSize))
    return `url(#${gradientId})`
  }

  return '#000000'
}

function renderGradientDef(gradient: GradientConfig, id: string, svgSize: number): string {
  const stops = gradient.stops
    .map((s) => `<stop offset="${s.offset * 100}%" stop-color="${s.color}"/>`)
    .join('')

  if (gradient.type === 'radial') {
    const half = svgSize / 2
    return `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${half}" cy="${half}" r="${half}">${stops}</radialGradient>`
  }

  const rotation = gradient.rotation ?? 0
  const rad = (rotation * Math.PI) / 180
  const half = svgSize / 2
  const x1 = half - Math.cos(rad) * half
  const y1 = half - Math.sin(rad) * half
  const x2 = half + Math.cos(rad) * half
  const y2 = half + Math.sin(rad) * half

  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient>`
}
