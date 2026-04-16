import { renderSVG } from './svg-renderer'
import { svgToPNG } from './export'
import { measureAllPanels } from './text-measurement'
import { computeTextPanelLayout } from './text-panels'
import type { TextPanelLayout } from './text-panels'
import type { QROptions, QRResult } from './types'

export function generateQRCode(options: QROptions): QRResult {
  let textPanelLayout: TextPanelLayout | undefined

  const activePanels = options.textPanels?.filter((p) => p.text.trim()) ?? []
  if (activePanels.length > 0) {
    const qrSize = options.size ?? 300
    const measured = measureAllPanels(activePanels, qrSize)
    if (measured.length > 0) {
      textPanelLayout = computeTextPanelLayout(qrSize, activePanels, measured, options.container)
    }
  }

  const { svg } = renderSVG(options, textPanelLayout)

  return {
    svg,
    toPNG: (size?: number) => svgToPNG(svg, size),
  }
}

export { renderSVG } from './svg-renderer'
export { generateMatrix, isInFinderPattern } from './matrix'
export { svgToPNG } from './export'
export { formatData, formatURL, formatWiFi, formatVCard, formatEmail, formatPhone, formatSMS } from './formatters'

export type {
  QROptions,
  QRResult,
  QRMatrix,
  FinderPattern,
  ErrorCorrectionLevel,
  DotStyle,
  CornerSquareStyle,
  CornerDotStyle,
  CornerOptions,
  ColorConfig,
  GradientConfig,
  GradientStop,
  LogoOptions,
  TextPosition,
  TextPanelOptions,
  ContainerOptions,
} from './types'

export type {
  DataType,
  WiFiFields,
  VCardFields,
  EmailFields,
  SMSFields,
} from './formatters'
