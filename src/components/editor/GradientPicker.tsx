import type { GradientConfig } from '../../lib/qr-engine'
import ColorPicker from './ColorPicker'

interface GradientPickerProps {
  gradient: GradientConfig
  onChange: (gradient: GradientConfig) => void
}

export default function GradientPicker({ gradient, onChange }: GradientPickerProps) {
  const startColor = gradient.stops[0]?.color ?? '#000000'
  const endColor = gradient.stops[1]?.color ?? '#000000'

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5" role="radiogroup" aria-label="Gradient type">
        <button
          type="button"
          role="radio"
          aria-checked={gradient.type === 'linear'}
          onClick={() => onChange({ ...gradient, type: 'linear' })}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${gradient.type === 'linear' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-slate-300 text-slate-600 hover:border-slate-400'}`}
        >
          Linear
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={gradient.type === 'radial'}
          onClick={() => onChange({ ...gradient, type: 'radial' })}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${gradient.type === 'radial' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-slate-300 text-slate-600 hover:border-slate-400'}`}
        >
          Radial
        </button>
      </div>

      <ColorPicker
        label="Start"
        color={startColor}
        onChange={(c) => onChange({ ...gradient, stops: [{ offset: 0, color: c }, gradient.stops[1] ?? { offset: 1, color: endColor }] })}
      />
      <ColorPicker
        label="End"
        color={endColor}
        onChange={(c) => onChange({ ...gradient, stops: [gradient.stops[0] ?? { offset: 0, color: startColor }, { offset: 1, color: c }] })}
      />

      {gradient.type === 'linear' && (
        <div>
          <label className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Angle</span>
            <span className="font-mono">{gradient.rotation ?? 0}&deg;</span>
          </label>
          <input
            type="range"
            min={0}
            max={360}
            value={gradient.rotation ?? 0}
            onChange={(e) => onChange({ ...gradient, rotation: Number(e.target.value) })}
            aria-label="Gradient angle"
            className="w-full"
          />
        </div>
      )}

      <div
        aria-hidden="true"
        className="h-7 rounded-lg border border-slate-200"
        style={{
          background: gradient.type === 'linear'
            ? `linear-gradient(${gradient.rotation ?? 0}deg, ${startColor}, ${endColor})`
            : `radial-gradient(circle, ${startColor}, ${endColor})`,
        }}
      />
    </div>
  )
}
