import type { CornerDotStyle, CornerSquareStyle, DotStyle, CornerOptions } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'
import StyleOption from './StyleOption'

const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy R.' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'star', label: 'Star' },
  { value: 'heart', label: 'Heart' },
  { value: 'hexagon', label: 'Hexagon' },
]

const CORNER_SQUARE_STYLES: { value: CornerSquareStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra R.' },
  { value: 'dot', label: 'Dot' },
  { value: 'classy', label: 'Classy' },
  { value: 'dot-corners', label: 'Dot Corners' },
]

const CORNER_DOT_STYLES: { value: CornerDotStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'heart', label: 'Heart' },
]

// Static preview objects — don't depend on current options
const DOT_PREVIEWS = DOT_STYLES.map((s) => ({ dotStyle: s.value }))
const CORNER_SQUARE_PREVIEWS = CORNER_SQUARE_STYLES.map((s) => ({ cornerOptions: { squareStyle: s.value, dotStyle: 'square' as CornerDotStyle } }))
const CORNER_DOT_PREVIEWS = CORNER_DOT_STYLES.map((s) => ({ cornerOptions: { squareStyle: 'square' as CornerSquareStyle, dotStyle: s.value } }))

interface StyleSectionProps {
  dotStyle: DotStyle
  cornerOptions: CornerOptions
  margin: number
  onDotStyleChange: (style: DotStyle) => void
  onCornerOptionsChange: (options: CornerOptions) => void
  onMarginChange: (margin: number) => void
}

export default function StyleSection({ dotStyle, cornerOptions, margin, onDotStyleChange, onCornerOptionsChange, onMarginChange }: StyleSectionProps) {
  return (
    <SectionWrapper title="Style">
      <div className="space-y-5">
        <div role="radiogroup" aria-label="Dot shape">
          <p className="text-xs font-medium text-slate-500 mb-2.5">Dot shape</p>
          <div className="flex flex-wrap gap-2">
            {DOT_STYLES.map((s, i) => (
              <StyleOption
                key={s.value}
                label={s.label}
                selected={dotStyle === s.value}
                onClick={() => onDotStyleChange(s.value)}
                previewOptions={DOT_PREVIEWS[i]}
              />
            ))}
          </div>
        </div>

        <div role="radiogroup" aria-label="Corner square style">
          <p className="text-xs font-medium text-slate-500 mb-2.5">Corner square</p>
          <div className="flex flex-wrap gap-2">
            {CORNER_SQUARE_STYLES.map((s, i) => (
              <StyleOption
                key={s.value}
                label={s.label}
                selected={(cornerOptions.squareStyle ?? 'square') === s.value}
                onClick={() => onCornerOptionsChange({ ...cornerOptions, squareStyle: s.value })}
                previewOptions={CORNER_SQUARE_PREVIEWS[i]}
              />
            ))}
          </div>
        </div>

        <div role="radiogroup" aria-label="Corner dot style">
          <p className="text-xs font-medium text-slate-500 mb-2.5">Corner dot</p>
          <div className="flex flex-wrap gap-2">
            {CORNER_DOT_STYLES.map((s, i) => (
              <StyleOption
                key={s.value}
                label={s.label}
                selected={(cornerOptions.dotStyle ?? 'square') === s.value}
                onClick={() => onCornerOptionsChange({ ...cornerOptions, dotStyle: s.value })}
                previewOptions={CORNER_DOT_PREVIEWS[i]}
              />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="padding-slider" className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
            <span>Padding</span>
            <span className="font-mono">{margin}</span>
          </label>
          <input
            id="padding-slider"
            type="range"
            min={0}
            max={6}
            value={margin}
            onChange={(e) => onMarginChange(Number(e.target.value))}
            aria-valuetext={`${margin} modules`}
            className="w-full"
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
