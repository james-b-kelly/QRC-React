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
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...gradient, type: 'linear' })}
          className={`px-3 py-1 text-xs rounded-full border ${gradient.type === 'linear' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300 text-gray-600'}`}
        >
          Linear
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...gradient, type: 'radial' })}
          className={`px-3 py-1 text-xs rounded-full border ${gradient.type === 'radial' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300 text-gray-600'}`}
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
          <label className="flex items-center gap-2 text-xs text-gray-500">
            Angle: {gradient.rotation ?? 0}&deg;
            <input
              type="range"
              min={0}
              max={360}
              value={gradient.rotation ?? 0}
              onChange={(e) => onChange({ ...gradient, rotation: Number(e.target.value) })}
              className="flex-1"
            />
          </label>
        </div>
      )}

      <div
        className="h-6 rounded-md border border-gray-200"
        style={{
          background: gradient.type === 'linear'
            ? `linear-gradient(${gradient.rotation ?? 0}deg, ${startColor}, ${endColor})`
            : `radial-gradient(circle, ${startColor}, ${endColor})`,
        }}
      />
    </div>
  )
}
