import type { CornerDotStyle, CornerSquareStyle, DotStyle, CornerOptions } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'
import StyleOption from './StyleOption'

const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy R.' },
]

const CORNER_SQUARE_STYLES: { value: CornerSquareStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra R.' },
  { value: 'dot', label: 'Dot' },
]

const CORNER_DOT_STYLES: { value: CornerDotStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
]

interface StyleSectionProps {
  dotStyle: DotStyle
  cornerOptions: CornerOptions
  onDotStyleChange: (style: DotStyle) => void
  onCornerOptionsChange: (options: CornerOptions) => void
}

export default function StyleSection({ dotStyle, cornerOptions, onDotStyleChange, onCornerOptionsChange }: StyleSectionProps) {
  return (
    <SectionWrapper title="Style">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Dot shape</p>
          <div className="flex flex-wrap gap-2">
            {DOT_STYLES.map((s) => (
              <StyleOption
                key={s.value}
                label={s.label}
                selected={dotStyle === s.value}
                onClick={() => onDotStyleChange(s.value)}
                previewOptions={{ dotStyle: s.value }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Corner square</p>
          <div className="flex flex-wrap gap-2">
            {CORNER_SQUARE_STYLES.map((s) => (
              <StyleOption
                key={s.value}
                label={s.label}
                selected={(cornerOptions.squareStyle ?? 'square') === s.value}
                onClick={() => onCornerOptionsChange({ ...cornerOptions, squareStyle: s.value })}
                previewOptions={{ cornerOptions: { ...cornerOptions, squareStyle: s.value } }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Corner dot</p>
          <div className="flex flex-wrap gap-2">
            {CORNER_DOT_STYLES.map((s) => (
              <StyleOption
                key={s.value}
                label={s.label}
                selected={(cornerOptions.dotStyle ?? 'square') === s.value}
                onClick={() => onCornerOptionsChange({ ...cornerOptions, dotStyle: s.value })}
                previewOptions={{ cornerOptions: { ...cornerOptions, dotStyle: s.value } }}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
