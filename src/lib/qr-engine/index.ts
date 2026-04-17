import { renderSVG } from './svg-renderer'
import { svgToPNG } from './export'
import { measureAllPanels } from './text-measurement'
import { computeTextPanelLayout } from './text-panels'
import type { TextPanelLayout } from './text-panels'
import type { QROptions, QRResult } from './types'

export function generateQRCode(options: QROptions): QRResult {
  let textPanelLayout: TextPanelLayout | undefined

  const activePanels = options.textPanel?.text.trim() ? [options.textPanel] : []
  const hasContainer = options.container && (
    (options.container.backgroundColor && options.container.backgroundColor !== '#FFFFFF') ||
    (options.container.cornerRadius && options.container.cornerRadius > 0) ||
    (options.container.borderWidth && options.container.borderWidth > 0) ||
    (options.container.padding && options.container.padding > 0) ||
    (options.container.backgroundOpacity !== undefined && options.container.backgroundOpacity < 1)
  )

  if (activePanels.length > 0 || hasContainer) {
    const qrSize = options.size ?? 300
    const measured = measureAllPanels(activePanels, qrSize)
    textPanelLayout = computeTextPanelLayout(qrSize, activePanels, measured, options.container)
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
