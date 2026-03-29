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

  const ctx: RenderContext = {
    matrix,
    moduleSize,
    margin,
    options: { ...options, dotStyle, size },
  }

  const defs: string[] = []
  let gradientId = 0

  // Build foreground color/gradient
  const fgColor = options.foregroundColor ?? { type: 'solid', color: '#000000' }
  const fgFill = resolveColor(fgColor, `fg-grad-${gradientId++}`, defs)

  // Build corner colors
  const cornerOpts = options.cornerOptions ?? {}
  const cornerSquareColor = cornerOpts.squareColor ?? fgColor
  const cornerDotColor = cornerOpts.dotColor ?? fgColor
  const cornerSquareFill = resolveColor(cornerSquareColor, `cs-grad-${gradientId++}`, defs)
  const cornerDotFill = resolveColor(cornerDotColor, `cd-grad-${gradientId++}`, defs)

  // Background
  const bgColor = options.backgroundColor ?? { type: 'solid', color: '#FFFFFF' }
  let bgRect = ''
  if (bgColor.type === 'solid' && bgColor.color === 'transparent') {
    // No background
  } else {
    const bgFill = resolveColor(bgColor, `bg-grad-${gradientId++}`, defs)
    bgRect = `<rect x="0" y="0" width="${size}" height="${size}" fill="${bgFill}"/>`
  }

  // Logo: determine which modules to clear
  const logoClearSet = new Set<string>()
  if (options.logo) {
    const logoRatio = Math.min(options.logo.sizeRatio ?? 0.25, 0.35)
    const logoPadding = options.logo.padding ?? 1
    const logoModules = Math.ceil(matrix.size * logoRatio) + logoPadding * 2
    const logoStart = Math.floor((matrix.size - logoModules) / 2)
    const logoEnd = logoStart + logoModules
    for (let r = logoStart; r < logoEnd; r++) {
      for (let c = logoStart; c < logoEnd; c++) {
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

  // Logo element — size matches the cleared module area (minus padding)
  let logoElement = ''
  if (options.logo) {
    const logoRatio = Math.min(options.logo.sizeRatio ?? 0.25, 0.35)
    const logoPadding = options.logo.padding ?? 1
    const logoModules = Math.ceil(matrix.size * logoRatio)
    const logoSize = logoModules * moduleSize
    const totalClearedModules = logoModules + logoPadding * 2
    const logoX = margin * moduleSize + ((matrix.size - totalClearedModules) / 2 + logoPadding) * moduleSize
    const logoY = logoX
    logoElement = `<image href="${options.logo.src}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid slice"/>`
  }

  // Assemble SVG
  const defsBlock = defs.length > 0 ? `<defs>${defs.join('')}</defs>` : ''

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`,
    defsBlock,
    bgRect,
    dotPaths.length > 0 ? `<path d="${dotPaths.join('')}" fill="${fgFill}"/>` : '',
    cornerSquarePaths.length > 0 ? `<path d="${cornerSquarePaths.join('')}" fill="${cornerSquareFill}" fill-rule="evenodd"/>` : '',
    cornerDotPaths.length > 0 ? `<path d="${cornerDotPaths.join('')}" fill="${cornerDotFill}"/>` : '',
    logoElement,
    '</svg>',
  ].join('')

  return { svg, matrix, effectiveECL: ecl }
}

function resolveColor(
  config: ColorConfig,
  gradientId: string,
  defs: string[],
): string {
  if (config.type === 'solid') {
    return config.color ?? '#000000'
  }

  if (config.gradient) {
    defs.push(renderGradientDef(config.gradient, gradientId))
    return `url(#${gradientId})`
  }

  return '#000000'
}

function renderGradientDef(gradient: GradientConfig, id: string): string {
  const stops = gradient.stops
    .map((s) => `<stop offset="${s.offset * 100}%" stop-color="${s.color}"/>`)
    .join('')

  if (gradient.type === 'radial') {
    return `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="50%">${stops}</radialGradient>`
  }

  const rotation = gradient.rotation ?? 0
  const rad = (rotation * Math.PI) / 180
  const x1 = 50 - Math.cos(rad) * 50
  const y1 = 50 - Math.sin(rad) * 50
  const x2 = 50 + Math.cos(rad) * 50
  const y2 = 50 + Math.sin(rad) * 50

  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">${stops}</linearGradient>`
}
