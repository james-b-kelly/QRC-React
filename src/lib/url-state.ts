import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import type { QROptions, ColorConfig, CornerOptions, DotStyle, CornerSquareStyle, CornerDotStyle, ErrorCorrectionLevel, GradientConfig } from './qr-engine'

// Version prefix for future schema migration
const VERSION = 1

// Short keys to minimize URL length
interface CompactColor {
  t: 'solid' | 'gradient'
  c?: string
  g?: {
    t: 'linear' | 'radial'
    s: { o: number; c: string }[]
    r?: number
  }
}

interface CompactCorners {
  ss?: CornerSquareStyle
  ds?: CornerDotStyle
  sc?: CompactColor
  dc?: CompactColor
}

interface CompactState {
  v: number
  d?: DotStyle
  co?: CompactCorners
  fg?: CompactColor
  bg?: CompactColor
  ec?: ErrorCorrectionLevel
  m?: number
}

// Valid values for runtime validation of decoded state
const VALID_DOT_STYLES = new Set<string>(['square', 'rounded', 'dots', 'classy', 'classy-rounded', 'diamond', 'star', 'heart', 'hexagon'])
const VALID_CORNER_SQUARE_STYLES = new Set<string>(['square', 'rounded', 'extra-rounded', 'dot', 'classy', 'dot-corners'])
const VALID_CORNER_DOT_STYLES = new Set<string>(['square', 'dot', 'diamond', 'heart'])
const VALID_ECL = new Set<string>(['L', 'M', 'Q', 'H'])

const DEFAULT_DOT_STYLE: DotStyle = 'rounded'
const DEFAULT_CORNER_SQUARE: CornerSquareStyle = 'rounded'
const DEFAULT_CORNER_DOT: CornerDotStyle = 'dot'
const DEFAULT_FG: ColorConfig = { type: 'solid', color: '#000000' }
const DEFAULT_BG: ColorConfig = { type: 'solid', color: '#FFFFFF' }
const DEFAULT_ECL: ErrorCorrectionLevel = 'M'
const DEFAULT_MARGIN = 2

function compactColor(c: ColorConfig | undefined): CompactColor | undefined {
  if (!c) return undefined
  if (c.type === 'solid') {
    return { t: 'solid', c: c.color }
  }
  if (c.gradient) {
    const g: CompactColor['g'] = {
      t: c.gradient.type,
      s: c.gradient.stops.map(s => ({ o: s.offset, c: s.color })),
    }
    if (c.gradient.rotation !== undefined) g.r = c.gradient.rotation
    return { t: 'gradient', g }
  }
  return undefined
}

function expandColor(c: CompactColor | undefined): ColorConfig | undefined {
  if (!c) return undefined
  if (c.t === 'solid') {
    if (!c.c) return undefined
    return { type: 'solid', color: c.c }
  }
  if (c.t === 'gradient' && c.g && Array.isArray(c.g.s) && c.g.s.length > 0) {
    const gradient: GradientConfig = {
      type: c.g.t,
      stops: c.g.s.map(s => ({ offset: s.o, color: s.c })),
    }
    if (c.g.r !== undefined) gradient.rotation = c.g.r
    return { type: 'gradient', gradient }
  }
  return undefined
}

function colorsEqual(a: ColorConfig | undefined, b: ColorConfig): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function encodeEditorState(options: QROptions): string {
  const state: CompactState = { v: VERSION }

  // Only encode non-default values to minimize size
  if (options.dotStyle && options.dotStyle !== DEFAULT_DOT_STYLE) {
    state.d = options.dotStyle
  }

  if (options.cornerOptions) {
    const co: CompactCorners = {}
    let hasCorner = false
    if (options.cornerOptions.squareStyle && options.cornerOptions.squareStyle !== DEFAULT_CORNER_SQUARE) {
      co.ss = options.cornerOptions.squareStyle
      hasCorner = true
    }
    if (options.cornerOptions.dotStyle && options.cornerOptions.dotStyle !== DEFAULT_CORNER_DOT) {
      co.ds = options.cornerOptions.dotStyle
      hasCorner = true
    }
    if (options.cornerOptions.squareColor) {
      co.sc = compactColor(options.cornerOptions.squareColor)
      hasCorner = true
    }
    if (options.cornerOptions.dotColor) {
      co.dc = compactColor(options.cornerOptions.dotColor)
      hasCorner = true
    }
    if (hasCorner) state.co = co
  }

  if (!colorsEqual(options.foregroundColor, DEFAULT_FG)) {
    state.fg = compactColor(options.foregroundColor)
  }
  if (!colorsEqual(options.backgroundColor, DEFAULT_BG)) {
    state.bg = compactColor(options.backgroundColor)
  }
  if (options.errorCorrectionLevel && options.errorCorrectionLevel !== DEFAULT_ECL) {
    state.ec = options.errorCorrectionLevel
  }
  if (options.margin !== undefined && options.margin !== DEFAULT_MARGIN) {
    state.m = options.margin
  }

  const json = JSON.stringify(state)
  return compressToEncodedURIComponent(json)
}

export function decodeEditorState(encoded: string): Partial<QROptions> | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded)
    if (!json) return null

    const state = JSON.parse(json) as CompactState
    if (typeof state.v !== 'number' || state.v > VERSION) return null

    const result: Partial<QROptions> = {}

    if (state.d && VALID_DOT_STYLES.has(state.d)) result.dotStyle = state.d
    if (state.co) {
      const corners: CornerOptions = {}
      if (state.co.ss && VALID_CORNER_SQUARE_STYLES.has(state.co.ss)) corners.squareStyle = state.co.ss
      if (state.co.ds && VALID_CORNER_DOT_STYLES.has(state.co.ds)) corners.dotStyle = state.co.ds
      if (state.co.sc) corners.squareColor = expandColor(state.co.sc)
      if (state.co.dc) corners.dotColor = expandColor(state.co.dc)
      result.cornerOptions = corners
    }
    if (state.fg) result.foregroundColor = expandColor(state.fg)
    if (state.bg) result.backgroundColor = expandColor(state.bg)
    if (state.ec && VALID_ECL.has(state.ec)) result.errorCorrectionLevel = state.ec
    if (state.m !== undefined && typeof state.m === 'number') result.margin = state.m

    return result
  } catch {
    return null
  }
}

export function getHashState(): Partial<QROptions> | null {
  const hash = window.location.hash
  if (!hash || !hash.startsWith('#s=')) return null
  return decodeEditorState(hash.slice(3))
}

export function setHashState(options: QROptions): void {
  const encoded = encodeEditorState(options)
  const newHash = `#s=${encoded}`
  if (window.location.hash !== newHash) {
    window.history.replaceState(null, '', newHash)
  }
}
