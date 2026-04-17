import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import type { QROptions, ColorConfig, CornerOptions, DotStyle, CornerSquareStyle, CornerDotStyle, ErrorCorrectionLevel, GradientConfig, TextPanelOptions, ContainerOptions } from './qr-engine'

// Version prefix for future schema migration
const VERSION = 2

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

interface CompactPanel {
  p: TextPanelOptions['position']
  f?: string      // font
  w?: string      // fontWeight
  s?: number      // fontSize
  c?: string      // textColor
  a?: 'left' | 'center' | 'right'
  l?: number      // lineSpacing
  pd?: number     // padding
}

interface CompactContainer {
  bg?: string
  bo?: number     // backgroundOpacity
  cr?: number     // cornerRadius
  bw?: number     // borderWidth
  bc?: string     // borderColor
  p?: number      // padding
}

interface CompactState {
  v: number
  d?: DotStyle
  co?: CompactCorners
  fg?: CompactColor
  bg?: CompactColor
  ec?: ErrorCorrectionLevel
  m?: number
  tp?: CompactPanel
  ct?: CompactContainer
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

  // Text panel — encode style only, no text content
  if (options.textPanel?.text.trim()) {
    const panel = options.textPanel
    const cp: CompactPanel = { p: panel.position }
    if (panel.font && panel.font !== 'Arial') cp.f = panel.font
    if (panel.fontWeight && panel.fontWeight !== '600') cp.w = panel.fontWeight
    if (panel.fontSize !== undefined && panel.fontSize !== 0.08) cp.s = panel.fontSize
    if (panel.textColor && panel.textColor !== '#000000') cp.c = panel.textColor
    if (panel.alignment && panel.alignment !== 'center') cp.a = panel.alignment
    if (panel.lineSpacing !== undefined && panel.lineSpacing !== 100) cp.l = panel.lineSpacing
    if (panel.padding !== undefined && panel.padding !== 0.04) cp.pd = panel.padding
    state.tp = cp
  }

  if (options.container) {
    const ct: CompactContainer = {}
    let hasCt = false
    if (options.container.backgroundColor && options.container.backgroundColor !== '#FFFFFF') { ct.bg = options.container.backgroundColor; hasCt = true }
    if (options.container.backgroundOpacity !== undefined && options.container.backgroundOpacity !== 1) { ct.bo = options.container.backgroundOpacity; hasCt = true }
    if (options.container.cornerRadius !== undefined && options.container.cornerRadius !== 0) { ct.cr = options.container.cornerRadius; hasCt = true }
    if (options.container.borderWidth !== undefined && options.container.borderWidth !== 0) { ct.bw = options.container.borderWidth; hasCt = true }
    if (options.container.borderColor && options.container.borderColor !== '#000000') { ct.bc = options.container.borderColor; hasCt = true }
    if (options.container.padding !== undefined && options.container.padding !== 0) { ct.p = options.container.padding; hasCt = true }
    if (hasCt) state.ct = ct
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
      const corners: CornerOptions = {
        squareStyle: DEFAULT_CORNER_SQUARE,
        dotStyle: DEFAULT_CORNER_DOT,
      }
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

    // V2: text panel
    if (state.tp && typeof state.tp === 'object' && !Array.isArray(state.tp)) {
      const cp = state.tp as CompactPanel
      const validPositions = new Set(['top', 'bottom', 'left', 'right'])
      if (validPositions.has(cp.p)) {
        const panel: TextPanelOptions = { text: '', position: cp.p }
        if (cp.f) panel.font = cp.f
        if (cp.w) panel.fontWeight = cp.w
        if (cp.s !== undefined) panel.fontSize = cp.s
        if (cp.c) panel.textColor = cp.c
        if (cp.a) panel.alignment = cp.a
        if (cp.l !== undefined) panel.lineSpacing = cp.l
        if (cp.pd !== undefined) panel.padding = cp.pd
        result.textPanel = panel
      }
    }

    if (state.ct) {
      const ct = state.ct as CompactContainer
      const container: ContainerOptions = {}
      if (ct.bg) container.backgroundColor = ct.bg
      if (ct.bo !== undefined) container.backgroundOpacity = ct.bo
      if (ct.cr !== undefined) container.cornerRadius = ct.cr
      if (ct.bw !== undefined) container.borderWidth = ct.bw
      if (ct.bc) container.borderColor = ct.bc
      if (ct.p !== undefined) container.padding = ct.p
      result.container = container
    }

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
