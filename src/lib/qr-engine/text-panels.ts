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

  // Build container SVG element — always rendered (container wraps QR with or without text)
  let containerSvg = ''
  {
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
 * Outer corners get rounded radii. Step transitions get rounded corners too:
 * concave arcs (sweep 0) where the path widens, convex arcs (sweep 1) at the new edge.
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
  const pathHalf = (inner: number) => (inner + halfBorder * 2) / 2
  const topPH = pathHalf(topZoneInner)
  const qrPH = pathHalf(qrZoneInner)
  const botPH = pathHalf(bottomZoneInner)

  const pathTop = halfBorder
  const pathBottom = viewBoxHeight - halfBorder

  const topStepY = halfBorder + cPad + topH
  const bottomStepY = halfBorder + cPad + topH + qrSize

  const topWidth = topPH * 2
  const qrWidth = qrPH * 2
  const botWidth = botPH * 2
  const topZoneH = topStepY - pathTop
  const qrZoneH = bottomStepY - topStepY
  const botZoneH = pathBottom - bottomStepY

  if (topBreaks && !bottomBreaks) {
    const rTop = Math.min(targetRadius, topWidth / 2, topZoneH / 2)
    const rBot = Math.min(targetRadius, qrWidth / 2, (qrZoneH + botZoneH) / 2)
    const wL = cx - topPH, wR = cx + topPH
    const nL = cx - qrPH, nR = cx + qrPH
    const stepSize = wR - nR
    const sr = Math.max(0, Math.min(targetRadius, stepSize, topZoneH - rTop, qrZoneH + botZoneH - rBot))

    return [
      `M ${wL + rTop} ${pathTop}`,
      `L ${wR - rTop} ${pathTop}`,
      `A ${rTop} ${rTop} 0 0 1 ${wR} ${pathTop + rTop}`,
      `L ${wR} ${topStepY - sr}`,
      `A ${sr} ${sr} 0 0 1 ${wR - sr} ${topStepY}`,
      `L ${nR + sr} ${topStepY}`,
      `A ${sr} ${sr} 0 0 0 ${nR} ${topStepY + sr}`,
      `L ${nR} ${pathBottom - rBot}`,
      `A ${rBot} ${rBot} 0 0 1 ${nR - rBot} ${pathBottom}`,
      `L ${nL + rBot} ${pathBottom}`,
      `A ${rBot} ${rBot} 0 0 1 ${nL} ${pathBottom - rBot}`,
      `L ${nL} ${topStepY + sr}`,
      `A ${sr} ${sr} 0 0 0 ${nL - sr} ${topStepY}`,
      `L ${wL + sr} ${topStepY}`,
      `A ${sr} ${sr} 0 0 1 ${wL} ${topStepY - sr}`,
      `L ${wL} ${pathTop + rTop}`,
      `A ${rTop} ${rTop} 0 0 1 ${wL + rTop} ${pathTop}`,
      'Z',
    ].join(' ')
  }

  if (bottomBreaks && !topBreaks) {
    const rTop = Math.min(targetRadius, qrWidth / 2, (topZoneH + qrZoneH) / 2)
    const rBot = Math.min(targetRadius, botWidth / 2, botZoneH / 2)
    const nL = cx - qrPH, nR = cx + qrPH
    const wL = cx - botPH, wR = cx + botPH
    const stepSize = wR - nR
    const sr = Math.max(0, Math.min(targetRadius, stepSize, topZoneH + qrZoneH - rTop, botZoneH - rBot))

    return [
      `M ${nL + rTop} ${pathTop}`,
      `L ${nR - rTop} ${pathTop}`,
      `A ${rTop} ${rTop} 0 0 1 ${nR} ${pathTop + rTop}`,
      `L ${nR} ${bottomStepY - sr}`,
      `A ${sr} ${sr} 0 0 0 ${nR + sr} ${bottomStepY}`,
      `L ${wR - sr} ${bottomStepY}`,
      `A ${sr} ${sr} 0 0 1 ${wR} ${bottomStepY + sr}`,
      `L ${wR} ${pathBottom - rBot}`,
      `A ${rBot} ${rBot} 0 0 1 ${wR - rBot} ${pathBottom}`,
      `L ${wL + rBot} ${pathBottom}`,
      `A ${rBot} ${rBot} 0 0 1 ${wL} ${pathBottom - rBot}`,
      `L ${wL} ${bottomStepY + sr}`,
      `A ${sr} ${sr} 0 0 1 ${wL + sr} ${bottomStepY}`,
      `L ${nL - sr} ${bottomStepY}`,
      `A ${sr} ${sr} 0 0 0 ${nL} ${bottomStepY - sr}`,
      `L ${nL} ${pathTop + rTop}`,
      `A ${rTop} ${rTop} 0 0 1 ${nL + rTop} ${pathTop}`,
      'Z',
    ].join(' ')
  }

  // Both break — wide top, narrow middle, wide bottom
  const rTop = Math.min(targetRadius, topWidth / 2, topZoneH / 2)
  const rBot = Math.min(targetRadius, botWidth / 2, botZoneH / 2)
  const tL = cx - topPH, tR = cx + topPH
  const nL = cx - qrPH, nR = cx + qrPH
  const bL = cx - botPH, bR = cx + botPH
  const topStepSize = tR - nR
  const botStepSize = bR - nR
  const srTop = Math.max(0, Math.min(targetRadius, topStepSize, topZoneH - rTop, qrZoneH / 2))
  const srBot = Math.max(0, Math.min(targetRadius, botStepSize, qrZoneH / 2, botZoneH - rBot))

  return [
    `M ${tL + rTop} ${pathTop}`,
    `L ${tR - rTop} ${pathTop}`,
    `A ${rTop} ${rTop} 0 0 1 ${tR} ${pathTop + rTop}`,
    `L ${tR} ${topStepY - srTop}`,
    `A ${srTop} ${srTop} 0 0 1 ${tR - srTop} ${topStepY}`,
    `L ${nR + srTop} ${topStepY}`,
    `A ${srTop} ${srTop} 0 0 0 ${nR} ${topStepY + srTop}`,
    `L ${nR} ${bottomStepY - srBot}`,
    `A ${srBot} ${srBot} 0 0 0 ${nR + srBot} ${bottomStepY}`,
    `L ${bR - srBot} ${bottomStepY}`,
    `A ${srBot} ${srBot} 0 0 1 ${bR} ${bottomStepY + srBot}`,
    `L ${bR} ${pathBottom - rBot}`,
    `A ${rBot} ${rBot} 0 0 1 ${bR - rBot} ${pathBottom}`,
    `L ${bL + rBot} ${pathBottom}`,
    `A ${rBot} ${rBot} 0 0 1 ${bL} ${pathBottom - rBot}`,
    `L ${bL} ${bottomStepY + srBot}`,
    `A ${srBot} ${srBot} 0 0 1 ${bL + srBot} ${bottomStepY}`,
    `L ${nL - srBot} ${bottomStepY}`,
    `A ${srBot} ${srBot} 0 0 0 ${nL} ${bottomStepY - srBot}`,
    `L ${nL} ${topStepY + srTop}`,
    `A ${srTop} ${srTop} 0 0 0 ${nL - srTop} ${topStepY}`,
    `L ${tL + srTop} ${topStepY}`,
    `A ${srTop} ${srTop} 0 0 1 ${tL} ${topStepY - srTop}`,
    `L ${tL} ${pathTop + rTop}`,
    `A ${rTop} ${rTop} 0 0 1 ${tL + rTop} ${pathTop}`,
    'Z',
  ].join(' ')
}
