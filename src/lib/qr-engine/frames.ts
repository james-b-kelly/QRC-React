import type { FrameOptions } from './types'

export interface FrameLayout {
  totalWidth: number
  totalHeight: number
  qrOffsetX: number
  qrOffsetY: number
  backgroundElements: string
  foregroundElements: string
}

const BANNER_HEIGHT_RATIO = 0.15 // banner is 15% of QR size
const BORDER_PADDING_RATIO = 0.06 // padding inside rounded border
const PILL_HEIGHT_RATIO = 0.1
const FONT_SIZE_RATIO = 0.06

export function computeFrameLayout(
  qrSize: number,
  frame: FrameOptions,
  fgColor: string,
): FrameLayout {
  const style = frame.style
  if (style === 'none') {
    return { totalWidth: qrSize, totalHeight: qrSize, qrOffsetX: 0, qrOffsetY: 0, backgroundElements: '', foregroundElements: '' }
  }

  const frameColor = frame.frameColor ?? fgColor
  const fontSize = qrSize * FONT_SIZE_RATIO
  const text = escapeXml(frame.text || 'SCAN ME')

  switch (style) {
    case 'banner-bottom': {
      const bannerH = qrSize * BANNER_HEIGHT_RATIO
      const textColor = frame.textColor ?? '#FFFFFF'
      const totalHeight = qrSize + bannerH
      const fg = `<rect x="0" y="${qrSize}" width="${qrSize}" height="${bannerH}" fill="${frameColor}"/>` +
        `<text x="${qrSize / 2}" y="${qrSize + bannerH / 2}" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="600" font-size="${fontSize}" fill="${textColor}">${text}</text>`
      return { totalWidth: qrSize, totalHeight, qrOffsetX: 0, qrOffsetY: 0, backgroundElements: '', foregroundElements: fg }
    }

    case 'banner-top': {
      const bannerH = qrSize * BANNER_HEIGHT_RATIO
      const textColor = frame.textColor ?? '#FFFFFF'
      const totalHeight = qrSize + bannerH
      const bg = `<rect x="0" y="0" width="${qrSize}" height="${bannerH}" fill="${frameColor}"/>` +
        `<text x="${qrSize / 2}" y="${bannerH / 2}" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="600" font-size="${fontSize}" fill="${textColor}">${text}</text>`
      return { totalWidth: qrSize, totalHeight, qrOffsetX: 0, qrOffsetY: bannerH, backgroundElements: bg, foregroundElements: '' }
    }

    case 'rounded-border': {
      const pad = qrSize * BORDER_PADDING_RATIO
      const bannerH = qrSize * BANNER_HEIGHT_RATIO
      const strokeW = pad * 0.4
      const halfStroke = strokeW / 2
      const totalWidth = qrSize + pad * 2
      const totalHeight = qrSize + pad * 2 + bannerH
      const r = pad * 2
      const textColor = frame.textColor ?? frameColor
      // Inset the rect by half stroke width so the stroke doesn't clip outside the viewBox
      const bg = `<rect x="${halfStroke}" y="${halfStroke}" width="${totalWidth - strokeW}" height="${totalHeight - strokeW}" rx="${r}" ry="${r}" fill="none" stroke="${frameColor}" stroke-width="${strokeW}"/>` +
        `<text x="${totalWidth / 2}" y="${qrSize + pad * 2 + bannerH / 2}" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="600" font-size="${fontSize}" fill="${textColor}">${text}</text>`
      return { totalWidth, totalHeight, qrOffsetX: pad, qrOffsetY: pad, backgroundElements: bg, foregroundElements: '' }
    }

    case 'pill-label': {
      const pillH = qrSize * PILL_HEIGHT_RATIO
      const pillW = qrSize * 0.6
      const pillR = pillH / 2
      const pillX = (qrSize - pillW) / 2
      const pillY = qrSize - pillH / 2 // overlaps bottom of QR
      const totalHeight = qrSize + pillH / 2
      const textColor = frame.textColor ?? '#FFFFFF'
      const fg = `<rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillR}" ry="${pillR}" fill="${frameColor}"/>` +
        `<text x="${qrSize / 2}" y="${pillY + pillH / 2}" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="600" font-size="${fontSize * 0.85}" fill="${textColor}">${text}</text>`
      return { totalWidth: qrSize, totalHeight, qrOffsetX: 0, qrOffsetY: 0, backgroundElements: '', foregroundElements: fg }
    }
  }
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
