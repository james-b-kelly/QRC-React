import type { TextPanelOptions, ContainerOptions } from './types'
import type { MeasuredPanel } from './text-measurement'

export interface TextPanelLayout {
  totalWidth: number
  totalHeight: number
  viewBoxWidth: number
  viewBoxHeight: number
  viewBoxOffsetX: number
  qrOffsetX: number
  qrOffsetY: number
  containerRect: {
    x: number
    y: number
    width: number
    height: number
    rx: number
    fill: string
    fillOpacity: number
    stroke: string
    strokeWidth: number
  } | null
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

  const top = findPanel(measured, 'top')
  const bottom = findPanel(measured, 'bottom')
  const left = findPanel(measured, 'left')
  const right = findPanel(measured, 'right')

  const topH = top?.height ?? 0
  const bottomH = bottom?.height ?? 0
  const leftW = left?.width ?? 0
  const rightW = right?.width ?? 0

  // Core container dimensions (without bounds-breaking panels)
  const containerWidth = cPad + leftW + qrSize + rightW + cPad + borderWidth * 2
  const containerHeight = cPad + topH + qrSize + bottomH + cPad + borderWidth * 2

  // Check if top/bottom panels break bounds
  const topBreaks = top && top.width > containerWidth
  const bottomBreaks = bottom && bottom.width > containerWidth

  const maxBreakingWidth = Math.max(
    topBreaks ? top!.width : 0,
    bottomBreaks ? bottom!.width : 0,
  )
  const viewBoxWidth = Math.max(containerWidth, maxBreakingWidth)
  const viewBoxOffsetX = (viewBoxWidth - containerWidth) / 2

  const viewBoxHeight = containerHeight

  // QR position within the container
  const qrOffsetX = viewBoxOffsetX + borderWidth + cPad + leftW
  const qrOffsetY = borderWidth + cPad + topH

  // Container background rect
  let containerRect: TextPanelLayout['containerRect'] = null
  if (measured.length > 0) {
    const bgColor = container?.backgroundColor ?? '#FFFFFF'
    const bgOpacity = container?.backgroundOpacity ?? 1
    const targetRadius = (container?.cornerRadius ?? 0) * qrSize
    const maxRadius = Math.min(containerWidth, containerHeight) / 2
    const rx = Math.min(targetRadius, maxRadius)
    const strokeColor = container?.borderColor ?? '#000000'

    containerRect = {
      x: viewBoxOffsetX + borderWidth / 2,
      y: borderWidth / 2,
      width: containerWidth - borderWidth,
      height: containerHeight - borderWidth,
      rx,
      fill: bgColor,
      fillOpacity: bgOpacity,
      stroke: borderWidth > 0 ? strokeColor : 'none',
      strokeWidth: borderWidth,
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
    const fontSize = (opts.fontSize ?? 0.06) * qrSize
    const lines = opts.text.split('\n')

    let panelX: number
    let panelY: number

    if (m.position === 'top') {
      panelX = qrOffsetX - leftW - cPad
      panelY = borderWidth + cPad
    } else if (m.position === 'bottom') {
      panelX = qrOffsetX - leftW - cPad
      panelY = qrOffsetY + qrSize
    } else if (m.position === 'left') {
      panelX = viewBoxOffsetX + borderWidth + cPad
      panelY = qrOffsetY
    } else {
      panelX = qrOffsetX + qrSize
      panelY = qrOffsetY
    }

    const isHorizontal = m.position === 'top' || m.position === 'bottom'
    const breaksContainer = isHorizontal && m.width > containerWidth

    // Draw independent background if text breaks bounds
    if (breaksContainer) {
      const bgX = (viewBoxWidth - m.width) / 2
      const bgY = panelY
      const maxR = m.height / 2
      const targetR = (container?.cornerRadius ?? 0) * qrSize
      const bgR = Math.min(targetR, maxR)
      const bgColor = container?.backgroundColor ?? '#FFFFFF'
      const bgOpacity = container?.backgroundOpacity ?? 1

      panelSvgParts.push(
        `<rect x="${bgX}" y="${bgY}" width="${m.width}" height="${m.height}" rx="${bgR}" ry="${bgR}" fill="${bgColor}" fill-opacity="${bgOpacity}"/>`
      )
    }

    // Draw text lines
    const textBlockWidth = m.width - padding * 2
    const textBlockX = breaksContainer
      ? (viewBoxWidth - m.width) / 2 + padding
      : panelX + padding

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
    totalWidth: containerWidth,
    totalHeight: containerHeight,
    viewBoxWidth,
    viewBoxHeight,
    viewBoxOffsetX,
    qrOffsetX,
    qrOffsetY,
    containerRect,
    panelElements: panelSvgParts.join(''),
  }
}
