import type { CornerDotStyle, CornerSquareStyle } from './types'

// Corner square: the outer ring of the 7x7 finder pattern
// Rendered as a single path at the given position, sized to cover 7 modules

export function renderCornerSquare(
  style: CornerSquareStyle,
  x: number,
  y: number,
  outerSize: number,
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
