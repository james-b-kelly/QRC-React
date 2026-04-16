import type { TextPanelOptions, ContainerOptions } from './types'
import type { MeasuredPanel } from './text-measurement'

export interface TextPanelLayout {
  viewBoxWidth: number
  viewBoxHeight: number
  qrOffsetX: number
  qrOffsetY: number
  containerSvg: string
  panelElements: string
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function findPanel(panels: MeasuredPanel[], position: TextPanelOptions['position']): MeasuredPanel | undefined {
  return panels.find((p) => p.position === position)
}

function findPanelOptions(panels: TextPanelOptions[], position: TextPanelOptions['position']): TextPanelOptions | undefined {
  return panels.find((p) => p.position === position && p.text.trim())
}

export function computeTextPanelLayout(
  qrSize: number,
  panels: TextPanelOptions[],
  measured: MeasuredPanel[],
  container: ContainerOptions | undefined,
): TextPanelLayout {
  const cPad = (container?.padding ?? 0) * qrSize
  const borderWidth = (container?.borderWidth ?? 0) * qrSize
  const halfBorder = borderWidth / 2

  const top = findPanel(measured, 'top')
  const bottom = findPanel(measured, 'bottom')
  const left = findPanel(measured, 'left')
  const right = findPanel(measured, 'right')

  const topH = top?.height ?? 0
  const bottomH = bottom?.height ?? 0
  const leftW = left?.width ?? 0
  const rightW = right?.width ?? 0

  // Inner widths (content + container padding, inside the border)
  const qrZoneInner = cPad + leftW + qrSize + rightW + cPad
  const topBreaks = top && top.width > qrZoneInner
  const bottomBreaks = bottom && bottom.width > qrZoneInner
  const topZoneInner = topBreaks ? top!.width : qrZoneInner
  const bottomZoneInner = bottomBreaks ? bottom!.width : qrZoneInner

  // Outer dimensions (inner + border on each side)
  const maxInner = Math.max(qrZoneInner, topZoneInner, bottomZoneInner)
  const viewBoxWidth = maxInner + borderWidth * 2
  const totalInnerHeight = cPad + topH + qrSize + bottomH + cPad
  const viewBoxHeight = totalInnerHeight + borderWidth * 2

  const cx = viewBoxWidth / 2

  // QR position (centered within the qr zone, which is centered in viewBox)
  const qrOffsetX = cx - qrZoneInner / 2 + cPad + leftW
  const qrOffsetY = borderWidth + cPad + topH

  // Build container SVG element
  let containerSvg = ''
  if (measured.length > 0) {
    const bgColor = container?.backgroundColor ?? '#FFFFFF'
    const bgOpacity = container?.backgroundOpacity ?? 1
    const targetRadius = (container?.cornerRadius ?? 0) * qrSize
    const strokeColor = container?.borderColor ?? '#000000'
    const strokeAttr = borderWidth > 0
      ? ` stroke="${strokeColor}" stroke-width="${borderWidth}"`
      : ''

    if (!topBreaks && !bottomBreaks) {
      // Simple rounded rect — no stepping needed
      const maxRadius = Math.min(viewBoxWidth - borderWidth, viewBoxHeight - borderWidth) / 2
      const rx = Math.min(targetRadius, maxRadius)
      containerSvg = `<rect x="${halfBorder}" y="${halfBorder}" width="${viewBoxWidth - borderWidth}" height="${viewBoxHeight - borderWidth}" rx="${rx}" ry="${rx}" fill="${bgColor}" fill-opacity="${bgOpacity}"${strokeAttr}/>`
    } else {
      // Stepped path — one continuous border around all zones
      const pathD = buildSteppedPath(
        cx, viewBoxWidth, viewBoxHeight,
        qrZoneInner, topZoneInner, bottomZoneInner,
        topH, qrSize, bottomH,
        cPad, halfBorder, targetRadius,
        topBreaks ?? false, bottomBreaks ?? false,
      )
      containerSvg = `<path d="${pathD}" fill="${bgColor}" fill-opacity="${bgOpacity}"${strokeAttr}/>`
    }
  }

  // Render panel text elements
  const panelSvgParts: string[] = []

  for (const m of measured) {
    const opts = findPanelOptions(panels, m.position)!
    const padding = (opts.padding ?? 0.04) * qrSize
    const alignment = opts.alignment ?? 'center'
    const textColor = opts.textColor ?? '#000000'
    const font = opts.font ?? 'Arial'
    const fontWeight = opts.fontWeight ?? '600'
    const fontSize = (opts.fontSize ?? 0.08) * qrSize
    const lines = opts.text.split('\n')

    // Panel position within the viewBox
    let panelX: number
    let panelY: number

    if (m.position === 'top') {
      panelX = cx - topZoneInner / 2
      panelY = borderWidth
    } else if (m.position === 'bottom') {
      panelX = cx - bottomZoneInner / 2
      panelY = borderWidth + cPad + topH + qrSize
    } else if (m.position === 'left') {
      panelX = cx - qrZoneInner / 2 + cPad
      panelY = qrOffsetY
    } else {
      panelX = qrOffsetX + qrSize
      panelY = qrOffsetY
    }

    // Draw text lines
    const textBlockWidth = m.width - padding * 2
    const textBlockX = panelX + padding

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue

      const lineWidth = m.lineWidths[i] ?? 0
      let lineX: number
      if (alignment === 'left') {
        lineX = textBlockX
      } else if (alignment === 'right') {
        lineX = textBlockX + textBlockWidth - lineWidth
      } else {
        lineX = textBlockX + (textBlockWidth - lineWidth) / 2
      }

      const lineY = panelY + padding + m.ascent + m.lineHeight * i

      panelSvgParts.push(
        `<text x="${lineX}" y="${lineY}" font-family="${font}" font-weight="${fontWeight}" font-size="${fontSize}" fill="${textColor}">${escapeXml(line)}</text>`
      )
    }
  }

  return {
    viewBoxWidth,
    viewBoxHeight,
    qrOffsetX,
    qrOffsetY,
    containerSvg,
    panelElements: panelSvgParts.join(''),
  }
}

/**
 * Build an SVG path for a stepped container shape.
 * The path traces at halfBorder inset from the viewBox edge (centered on the stroke).
 * Outer corners get rounded radii; step transitions are sharp 90° corners.
 */
function buildSteppedPath(
  cx: number,
  _viewBoxWidth: number,
  viewBoxHeight: number,
  qrZoneInner: number,
  topZoneInner: number,
  bottomZoneInner: number,
  topH: number,
  qrSize: number,
  _bottomH: number,
  cPad: number,
  halfBorder: number,
  targetRadius: number,
  topBreaks: boolean,
  bottomBreaks: boolean,
): string {
  // Path coordinates for each zone (centered, at halfBorder from outer edge)
  const pathHalf = (inner: number) => (inner + halfBorder * 2) / 2
  const topPH = pathHalf(topZoneInner)
  const qrPH = pathHalf(qrZoneInner)
  const botPH = pathHalf(bottomZoneInner)

  const pathTop = halfBorder
  const pathBottom = viewBoxHeight - halfBorder

  // Step Y positions (where width transitions happen)
  const topStepY = halfBorder + cPad + topH
  const bottomStepY = halfBorder + cPad + topH + qrSize

  // Zone dimensions for radius clamping
  const topWidth = topPH * 2
  const qrWidth = qrPH * 2
  const botWidth = botPH * 2
  const topZoneH = topStepY - pathTop
  const qrZoneH = bottomStepY - topStepY
  const botZoneH = pathBottom - bottomStepY

  // Clamp radii per zone (half of smallest dimension)
  const r = targetRadius

  if (topBreaks && !bottomBreaks) {
    // Wide top, narrow bottom — step inward at topStepY
    const rTop = Math.min(r, topWidth / 2, topZoneH / 2)
    const rBot = Math.min(r, qrWidth / 2, (qrZoneH + botZoneH) / 2)
    const wL = cx - topPH, wR = cx + topPH
    const nL = cx - qrPH, nR = cx + qrPH

    return [
      `M ${wL + rTop} ${pathTop}`,
      `L ${wR - rTop} ${pathTop}`,
      `A ${rTop} ${rTop} 0 0 1 ${wR} ${pathTop + rTop}`,
      `L ${wR} ${topStepY}`,
      `L ${nR} ${topStepY}`,
      `L ${nR} ${pathBottom - rBot}`,
      `A ${rBot} ${rBot} 0 0 1 ${nR - rBot} ${pathBottom}`,
      `L ${nL + rBot} ${pathBottom}`,
      `A ${rBot} ${rBot} 0 0 1 ${nL} ${pathBottom - rBot}`,
      `L ${nL} ${topStepY}`,
      `L ${wL} ${topStepY}`,
      `L ${wL} ${pathTop + rTop}`,
      `A ${rTop} ${rTop} 0 0 1 ${wL + rTop} ${pathTop}`,
      'Z',
    ].join(' ')
  }

  if (bottomBreaks && !topBreaks) {
    // Narrow top, wide bottom — step outward at bottomStepY
    const rTop = Math.min(r, qrWidth / 2, (topZoneH + qrZoneH) / 2)
    const rBot = Math.min(r, botWidth / 2, botZoneH / 2)
    const nL = cx - qrPH, nR = cx + qrPH
    const wL = cx - botPH, wR = cx + botPH

    return [
      `M ${nL + rTop} ${pathTop}`,
      `L ${nR - rTop} ${pathTop}`,
      `A ${rTop} ${rTop} 0 0 1 ${nR} ${pathTop + rTop}`,
      `L ${nR} ${bottomStepY}`,
      `L ${wR} ${bottomStepY}`,
      `L ${wR} ${pathBottom - rBot}`,
      `A ${rBot} ${rBot} 0 0 1 ${wR - rBot} ${pathBottom}`,
      `L ${wL + rBot} ${pathBottom}`,
      `A ${rBot} ${rBot} 0 0 1 ${wL} ${pathBottom - rBot}`,
      `L ${wL} ${bottomStepY}`,
      `L ${nL} ${bottomStepY}`,
      `L ${nL} ${pathTop + rTop}`,
      `A ${rTop} ${rTop} 0 0 1 ${nL + rTop} ${pathTop}`,
      'Z',
    ].join(' ')
  }

  // Both break — wide top, narrow middle, wide bottom
  const rTop = Math.min(r, topWidth / 2, topZoneH / 2)
  const rBot = Math.min(r, botWidth / 2, botZoneH / 2)
  const tL = cx - topPH, tR = cx + topPH
  const nL = cx - qrPH, nR = cx + qrPH
  const bL = cx - botPH, bR = cx + botPH

  return [
    `M ${tL + rTop} ${pathTop}`,
    `L ${tR - rTop} ${pathTop}`,
    `A ${rTop} ${rTop} 0 0 1 ${tR} ${pathTop + rTop}`,
    `L ${tR} ${topStepY}`,
    `L ${nR} ${topStepY}`,
    `L ${nR} ${bottomStepY}`,
    `L ${bR} ${bottomStepY}`,
    `L ${bR} ${pathBottom - rBot}`,
    `A ${rBot} ${rBot} 0 0 1 ${bR - rBot} ${pathBottom}`,
    `L ${bL + rBot} ${pathBottom}`,
    `A ${rBot} ${rBot} 0 0 1 ${bL} ${pathBottom - rBot}`,
    `L ${bL} ${bottomStepY}`,
    `L ${nL} ${bottomStepY}`,
    `L ${nL} ${topStepY}`,
    `L ${tL} ${topStepY}`,
    `L ${tL} ${pathTop + rTop}`,
    `A ${rTop} ${rTop} 0 0 1 ${tL + rTop} ${pathTop}`,
    'Z',
  ].join(' ')
}
