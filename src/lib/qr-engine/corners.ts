import type { CornerDotStyle, CornerSquareStyle } from './types'

// Corner square: the outer ring of the 7x7 finder pattern
// Rendered as a single path at the given position, sized to cover 7 modules

// cornerIndex: 0 = top-left, 1 = top-right, 2 = bottom-left
export function renderCornerSquare(
  style: CornerSquareStyle,
  x: number,
  y: number,
  outerSize: number,
  cornerIndex: number = 0,
): string {
  const innerSize = outerSize * (5 / 7)
  const innerOffset = outerSize * (1 / 7)

  switch (style) {
    case 'square':
      return (
        // Outer square
        `M${x},${y}h${outerSize}v${outerSize}h${-outerSize}z` +
        // Inner cutout (counter-clockwise for hole)
        `M${x + innerOffset},${y + innerOffset}v${innerSize}h${innerSize}v${-innerSize}z`
      )

    case 'rounded': {
      const rOuter = outerSize * 0.15
      const rInner = innerSize * 0.15
      return (
        roundedRect(x, y, outerSize, outerSize, rOuter, true) +
        roundedRect(x + innerOffset, y + innerOffset, innerSize, innerSize, rInner, false)
      )
    }

    case 'extra-rounded': {
      const rOuter = outerSize * 0.3
      const rInner = innerSize * 0.25
      return (
        roundedRect(x, y, outerSize, outerSize, rOuter, true) +
        roundedRect(x + innerOffset, y + innerOffset, innerSize, innerSize, rInner, false)
      )
    }

    case 'dot': {
      const rOuter = outerSize / 2
      const rInner = innerSize / 2
      const cx = x + rOuter
      const cy = y + rOuter
      return (
        // Outer circle (clockwise)
        `M${cx - rOuter},${cy}a${rOuter},${rOuter} 0 1 1 ${outerSize},0a${rOuter},${rOuter} 0 1 1 ${-outerSize},0z` +
        // Inner circle cutout (counter-clockwise)
        `M${cx - rInner},${cy}a${rInner},${rInner} 0 1 0 ${innerSize},0a${rInner},${rInner} 0 1 0 ${-innerSize},0z`
      )
    }

    case 'classy': {
      // Square with the outer corner rounded (corner facing away from QR center)
      const rOuter = outerSize * 0.3
      const rInner = innerSize * 0.25
      // cornerIndex: 0=top-left, 1=top-right, 2=bottom-left
      const corner = cornerIndex === 1 ? 'top-right' : cornerIndex === 2 ? 'bottom-left' : 'top-left'
      return (
        classyRect(x, y, outerSize, outerSize, rOuter, true, corner) +
        classyRect(x + innerOffset, y + innerOffset, innerSize, innerSize, rInner, false, corner)
      )
    }

    case 'dot-corners': {
      // Plain square with decorative circles at each corner
      const dotR = outerSize * 0.1
      return (
        // Outer square (sharp corners — no overlap with circles)
        `M${x},${y}h${outerSize}v${outerSize}h${-outerSize}z` +
        // Inner cutout (counter-clockwise)
        `M${x + innerOffset},${y + innerOffset}v${innerSize}h${innerSize}v${-innerSize}z` +
        // Decorative corner dots extending outward from corners
        circle(x, y, dotR) +
        circle(x + outerSize, y, dotR) +
        circle(x, y + outerSize, dotR) +
        circle(x + outerSize, y + outerSize, dotR)
      )
    }
  }
}

// Corner dot: the inner 3x3 center of the finder pattern

export function renderCornerDot(
  style: CornerDotStyle,
  x: number,
  y: number,
  dotSize: number,
): string {
  switch (style) {
    case 'square':
      return `M${x},${y}h${dotSize}v${dotSize}h${-dotSize}z`

    case 'dot': {
      const r = dotSize / 2
      const cx = x + r
      const cy = y + r
      return `M${cx - r},${cy}a${r},${r} 0 1 1 ${dotSize},0a${r},${r} 0 1 1 ${-dotSize},0z`
    }

    case 'diamond': {
      const half = dotSize / 2
      const cx = x + half
      return (
        `M${cx},${y}` +
        `l${half},${half}` +
        `l${-half},${half}` +
        `l${-half},${-half}z`
      )
    }

    case 'heart': {
      const s = dotSize
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
  }
}

function circle(cx: number, cy: number, r: number): string {
  return `M${cx - r},${cy}a${r},${r} 0 1 1 ${r * 2},0a${r},${r} 0 1 1 ${-r * 2},0z`
}

function classyRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  clockwise: boolean,
  corner: 'top-left' | 'top-right' | 'bottom-left' = 'top-left',
): string {
  // Square with one rounded corner — which corner depends on the finder pattern position
  if (clockwise) {
    switch (corner) {
      case 'top-left':
        return `M${x + r},${y}h${w - r}v${h}h${-w}v${-(h - r)}a${r},${r} 0 0 1 ${r},${-r}z`
      case 'top-right':
        return `M${x},${y}h${w - r}a${r},${r} 0 0 1 ${r},${r}v${h - r}h${-w}v${-h}z`
      case 'bottom-left':
        return `M${x},${y}h${w}v${h}h${-(w - r)}a${r},${r} 0 0 1 ${-r},${-r}v${-(h - r)}z`
    }
  }
  // Counter-clockwise (for cutout holes)
  switch (corner) {
    case 'top-left':
      return `M${x + r},${y}a${r},${r} 0 0 0 ${-r},${r}v${h - r}h${w}v${-h}h${-(w - r)}z`
    case 'top-right':
      return `M${x},${y}v${h}h${w}v${-(h - r)}a${r},${r} 0 0 0 ${-r},${-r}h${-(w - r)}z`
    case 'bottom-left':
      return `M${x},${y}h${w}v${h}h${-(w - r)}a${r},${r} 0 0 0 ${-r},${-r}v${-(h - r)}z`
  }
}

function roundedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  clockwise: boolean,
): string {
  if (clockwise) {
    return (
      `M${x + r},${y}` +
      `h${w - 2 * r}a${r},${r} 0 0 1 ${r},${r}` +
      `v${h - 2 * r}a${r},${r} 0 0 1 ${-r},${r}` +
      `h${-(w - 2 * r)}a${r},${r} 0 0 1 ${-r},${-r}` +
      `v${-(h - 2 * r)}a${r},${r} 0 0 1 ${r},${-r}z`
    )
  }
  // Counter-clockwise (for cutout holes)
  return (
    `M${x + r},${y}` +
    `a${r},${r} 0 0 0 ${-r},${r}` +
    `v${h - 2 * r}a${r},${r} 0 0 0 ${r},${r}` +
    `h${w - 2 * r}a${r},${r} 0 0 0 ${r},${-r}` +
    `v${-(h - 2 * r)}a${r},${r} 0 0 0 ${-r},${-r}z`
  )
}
