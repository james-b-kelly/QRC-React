export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export type DotStyle = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'diamond' | 'star' | 'heart' | 'hexagon'

export type CornerSquareStyle = 'square' | 'rounded' | 'extra-rounded' | 'dot' | 'classy' | 'dot-corners'

export type CornerDotStyle = 'square' | 'dot' | 'diamond' | 'heart'

export interface GradientStop {
  offset: number
  color: string
}

export interface GradientConfig {
  type: 'linear' | 'radial'
  stops: GradientStop[]
  rotation?: number // degrees, for linear gradients
}

export interface ColorConfig {
  type: 'solid' | 'gradient'
  color?: string // for solid
  gradient?: GradientConfig // for gradient
}

export interface LogoOptions {
  src: string // data URL or image URL
  sizeRatio?: number // 0-0.35, default 0.25
  padding?: number // modules of padding around logo, default 1
}

export interface CornerOptions {
  squareStyle?: CornerSquareStyle
  dotStyle?: CornerDotStyle
  squareColor?: ColorConfig
  dotColor?: ColorConfig
}

export type TextPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TextPanelOptions {
  text: string
  position: TextPosition
  font?: string
  fontWeight?: string
  fontSize?: number
  textColor?: string
  alignment?: 'left' | 'center' | 'right'
  lineSpacing?: number
  padding?: number
}

export interface ContainerOptions {
  backgroundColor?: string
  backgroundOpacity?: number
  cornerRadius?: number
  borderWidth?: number
  borderColor?: string
  padding?: number
}

export interface QROptions {
  data: string
  errorCorrectionLevel?: ErrorCorrectionLevel
  dotStyle?: DotStyle
  cornerOptions?: CornerOptions
  foregroundColor?: ColorConfig
  backgroundColor?: ColorConfig
  logo?: LogoOptions
  margin?: number // modules of quiet zone, default 2
  size?: number // SVG viewBox size in px, default 300
  textPanel?: TextPanelOptions
  container?: ContainerOptions
}

export interface QRMatrix {
  modules: boolean[][]
  size: number // number of modules per side
  finderPatterns: FinderPattern[]
}

export interface FinderPattern {
  row: number
  col: number
}

export interface QRResult {
  svg: string
  toPNG: (size?: number) => Promise<Blob>
}
