import type { ErrorCorrectionLevel } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'

const ECL_OPTIONS: { value: ErrorCorrectionLevel; label: string; description: string }[] = [
  { value: 'L', label: 'L', description: '7% recovery' },
  { value: 'M', label: 'M', description: '15% recovery' },
  { value: 'Q', label: 'Q', description: '25% recovery' },
  { value: 'H', label: 'H', description: '30% recovery' },
]

interface AdvancedSectionProps {
  errorCorrectionLevel: ErrorCorrectionLevel
  margin: number
  hasLogo: boolean
  onECLChange: (ecl: ErrorCorrectionLevel) => void
  onMarginChange: (margin: number) => void
}

export default function AdvancedSection({ errorCorrectionLevel, margin, hasLogo, onECLChange, onMarginChange }: AdvancedSectionProps) {
  return (
    <SectionWrapper title="Advanced" defaultOpen={false}>
      <div className="space-y-5">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2.5">Error correction</p>
          <div className="flex rounded-lg border border-slate-300 overflow-hidden" role="radiogroup" aria-label="Error correction level">
            {ECL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={errorCorrectionLevel === opt.value}
                onClick={() => onECLChange(opt.value)}
                className={`flex-1 py-2.5 text-center text-sm font-medium transition-colors cursor-pointer ${
                  errorCorrectionLevel === opt.value
                    ? 'bg-brand-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                title={opt.description}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {ECL_OPTIONS.find((o) => o.value === errorCorrectionLevel)?.description}
            {hasLogo && ' — auto-adjusted for logo'}
          </p>
        </div>

        <div>
          <label htmlFor="margin-slider" className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
            <span>Margin (quiet zone)</span>
            <span className="font-mono">{margin}</span>
          </label>
          <input
            id="margin-slider"
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
