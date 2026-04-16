import type { TextPanelOptions } from './types'

export interface MeasuredPanel {
  position: TextPanelOptions['position']
  width: number
  height: number
  lineWidths: number[]
  lineHeight: number
  ascent: number
}

let measureSvg: SVGSVGElement | null = null
let measureText: SVGTextElement | null = null

function ensureMeasureElements(): { svg: SVGSVGElement; text: SVGTextElement } {
  if (!measureSvg) {
    measureSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    measureSvg.setAttribute('width', '0')
    measureSvg.setAttribute('height', '0')
    measureSvg.style.position = 'absolute'
    measureSvg.style.visibility = 'hidden'
    measureSvg.style.overflow = 'hidden'
    document.body.appendChild(measureSvg)
  }
  if (!measureText) {
    measureText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    measureSvg.appendChild(measureText)
  }
  return { svg: measureSvg, text: measureText }
}

export function measureTextPanel(
  panel: TextPanelOptions,
  qrSize: number,
): MeasuredPanel | null {
  if (!panel.text.trim()) return null

  const { text: textEl } = ensureMeasureElements()
  const fontSize = (panel.fontSize ?? 0.06) * qrSize
  const font = panel.font ?? 'Arial'
  const fontWeight = panel.fontWeight ?? '600'
  const lineSpacingMultiplier = Math.max(0.5, (panel.lineSpacing ?? 100) / 100)
  const padding = (panel.padding ?? 0.04) * qrSize

  textEl.setAttribute('font-family', font)
  textEl.setAttribute('font-size', `${fontSize}`)
  textEl.setAttribute('font-weight', fontWeight)
  textEl.setAttribute('dominant-baseline', 'alphabetic')

  const lines = panel.text.split('\n')
  const lineWidths: number[] = []
  let maxWidth = 0
  let ascent = 0

  for (const line of lines) {
    textEl.textContent = line || '\u00A0'
    const bbox = textEl.getBBox()
    const width = line ? bbox.width : 0
    lineWidths.push(width)
    maxWidth = Math.max(maxWidth, width)
    if (ascent === 0) {
      ascent = Math.abs(bbox.y)
    }
  }

  const baseLineHeight = fontSize
  const lineHeight = baseLineHeight * lineSpacingMultiplier
  const textHeight = lineHeight * lines.length
  const totalWidth = maxWidth + padding * 2
  const totalHeight = textHeight + padding * 2

  return {
    position: panel.position,
    width: totalWidth,
    height: totalHeight,
    lineWidths,
    lineHeight,
    ascent,
  }
}

export function measureAllPanels(
  panels: TextPanelOptions[],
  qrSize: number,
): MeasuredPanel[] {
  return panels
    .map((p) => measureTextPanel(p, qrSize))
    .filter((m): m is MeasuredPanel => m !== null)
}
