import type { DotStyle } from './types'

type DotRenderer = (x: number, y: number, size: number) => string

function squareDot(x: number, y: number, size: number): string {
  return `M${x},${y}h${size}v${size}h${-size}z`
}

function roundedDot(x: number, y: number, size: number): string {
  const r = size * 0.3
  return (
    `M${x + r},${y}` +
    `h${size - 2 * r}` +
    `a${r},${r} 0 0 1 ${r},${r}` +
    `v${size - 2 * r}` +
    `a${r},${r} 0 0 1 ${-r},${r}` +
    `h${-(size - 2 * r)}` +
    `a${r},${r} 0 0 1 ${-r},${-r}` +
    `v${-(size - 2 * r)}` +
    `a${r},${r} 0 0 1 ${r},${-r}z`
  )
}

function circleDot(x: number, y: number, size: number): string {
  const r = size / 2
  const cx = x + r
  const cy = y + r
  return (
    `M${cx - r},${cy}` +
    `a${r},${r} 0 1 1 ${size},0` +
    `a${r},${r} 0 1 1 ${-size},0z`
  )
}

function classyDot(x: number, y: number, size: number): string {
  // Square with top-left corner rounded
  const r = size * 0.4
  return (
    `M${x + r},${y}` +
    `h${size - r}` +
    `v${size}` +
    `h${-size}` +
    `v${-(size - r)}` +
    `a${r},${r} 0 0 1 ${r},${-r}z`
  )
}

function classyRoundedDot(x: number, y: number, size: number): string {
  // Rounded rect with top-left corner extra-rounded
  const r = size * 0.25
  const rBig = size * 0.5
  return (
    `M${x + rBig},${y}` +
    `h${size - rBig - r}` +
    `a${r},${r} 0 0 1 ${r},${r}` +
    `v${size - 2 * r}` +
    `a${r},${r} 0 0 1 ${-r},${r}` +
    `h${-(size - 2 * r)}` +
    `a${r},${r} 0 0 1 ${-r},${-r}` +
    `v${-(size - rBig - r)}` +
    `a${rBig},${rBig} 0 0 1 ${rBig},${-rBig}z`
  )
}

const DOT_RENDERERS: Record<DotStyle, DotRenderer> = {
  square: squareDot,
  rounded: roundedDot,
  dots: circleDot,
  classy: classyDot,
  'classy-rounded': classyRoundedDot,
}

export function renderDot(
  style: DotStyle,
  x: number,
  y: number,
  size: number,
): string {
  return DOT_RENDERERS[style](x, y, size)
}
