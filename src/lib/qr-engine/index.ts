import { renderSVG } from './svg-renderer'
import { svgToPNG } from './export'
import type { QROptions, QRResult } from './types'

export function generateQRCode(options: QROptions): QRResult {
  const { svg } = renderSVG(options)

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
  FrameStyle,
  FrameOptions,
} from './types'

export type {
  DataType,
  WiFiFields,
  VCardFields,
  EmailFields,
  SMSFields,
} from './formatters'
