interface SliderRowProps {
  label: string
  value: number
  displayValue: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  id?: string
}

export default function SliderRow({ label, value, displayValue, min, max, step, onChange, id }: SliderRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 w-16 shrink-0">{label}</span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1.5"
      />
      <span className="text-xs text-slate-400 font-mono w-9 text-right shrink-0">{displayValue}</span>
    </div>
  )
}
