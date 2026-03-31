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

function diamondDot(x: number, y: number, size: number): string {
  const half = size / 2
  const cx = x + half
  const cy = y + half
  return (
    `M${cx},${y}` +
    `l${half},${half}` +
    `l${-half},${half}` +
    `l${-half},${-half}z`
  )
}

function starDot(x: number, y: number, size: number): string {
  const cx = x + size / 2
  const cy = y + size / 2
  const outerR = size / 2
  const innerR = outerR * 0.4
  const points = 4
  const parts: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = (Math.PI / points) * i - Math.PI / 2
    const px = cx + r * Math.cos(angle)
    const py = cy + r * Math.sin(angle)
    parts.push(i === 0 ? `M${px},${py}` : `L${px},${py}`)
  }
  parts.push('z')
  return parts.join('')
}

function heartDot(x: number, y: number, size: number): string {
  const s = size
  const cx = x + s / 2
  const top = y + s * 0.2
  const r = s * 0.25
  return (
    `M${cx},${y + s * 0.9}` +
    `C${x},${y + s * 0.55} ${x},${top} ${cx - r},${top}` +
    `A${r},${r} 0 0 1 ${cx},${y + s * 0.4}` +
    `A${r},${r} 0 0 1 ${cx + r},${top}` +
    `C${x + s},${top} ${x + s},${y + s * 0.55} ${cx},${y + s * 0.9}z`
  )
}

function hexagonDot(x: number, y: number, size: number): string {
  const cx = x + size / 2
  const cy = y + size / 2
  const r = size / 2
  const parts: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2
    const px = cx + r * Math.cos(angle)
    const py = cy + r * Math.sin(angle)
    parts.push(i === 0 ? `M${px},${py}` : `L${px},${py}`)
  }
  parts.push('z')
  return parts.join('')
}

const DOT_RENDERERS: Record<DotStyle, DotRenderer> = {
  square: squareDot,
  rounded: roundedDot,
  dots: circleDot,
  classy: classyDot,
  'classy-rounded': classyRoundedDot,
  diamond: diamondDot,
  star: starDot,
  heart: heartDot,
  hexagon: hexagonDot,
}

export function renderDot(
  style: DotStyle,
  x: number,
  y: number,
  size: number,
): string {
  return DOT_RENDERERS[style](x, y, size)
}
