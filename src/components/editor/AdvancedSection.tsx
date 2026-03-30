import type { ErrorCorrectionLevel } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'

const ECL_OPTIONS: { value: ErrorCorrectionLevel; label: string; description: string }[] = [
  { value: 'L', label: 'Low', description: 'Smallest QR, least damage tolerance' },
  { value: 'M', label: 'Medium', description: 'Good balance of size and resilience' },
  { value: 'Q', label: 'High', description: 'Tolerates moderate damage or obstruction' },
  { value: 'H', label: 'Max', description: 'Best for logos — survives up to 30% damage' },
]

interface AdvancedSectionProps {
  errorCorrectionLevel: ErrorCorrectionLevel
  hasLogo: boolean
  onECLChange: (ecl: ErrorCorrectionLevel) => void
}

export default function AdvancedSection({ errorCorrectionLevel, hasLogo, onECLChange }: AdvancedSectionProps) {
  return (
    <SectionWrapper title="Advanced" defaultOpen={false}>
      <div>
        <p className="text-xs font-medium text-slate-500 mb-1">Error correction</p>
        <p className="text-[11px] text-slate-400 mb-2.5">
          Higher levels make the QR more resilient to damage or obstruction, but increase its size.
        </p>
        <div className="flex rounded-lg border border-slate-300 overflow-hidden" role="radiogroup" aria-label="Error correction level">
          {ECL_OPTIONS.map((opt) => {
            const disabled = hasLogo && (opt.value === 'L' || opt.value === 'M')
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={errorCorrectionLevel === opt.value}
                aria-disabled={disabled}
                onClick={() => !disabled && onECLChange(opt.value)}
                className={`flex-1 py-2.5 text-center text-xs font-medium transition-colors ${
                  disabled
                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                    : errorCorrectionLevel === opt.value
                      ? 'bg-brand-500 text-white cursor-pointer'
                      : 'bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'
                }`}
                title={disabled ? 'Requires higher correction for logo' : opt.description}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        <p className="text-[11px] text-slate-400 mt-1.5">
          {ECL_OPTIONS.find((o) => o.value === errorCorrectionLevel)?.description}
          {hasLogo && ' — L and M disabled when a logo is present'}
        </p>
      </div>
    </SectionWrapper>
  )
}
