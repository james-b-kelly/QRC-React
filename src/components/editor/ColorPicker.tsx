import { useEffect, useState } from 'react'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
}

export default function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(color)

  useEffect(() => setHexInput(color), [color])

  function handleHexChange(value: string) {
    setHexInput(value)
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      onChange(value)
    }
  }

  function handleNativeChange(value: string) {
    setHexInput(value)
    onChange(value)
  }

  return (
    <div className="flex items-center gap-2.5">
      {label && <span className="text-xs font-medium text-slate-500 w-14 shrink-0">{label}</span>}
      <input
        type="color"
        value={color}
        onChange={(e) => handleNativeChange(e.target.value)}
        aria-label={label ? `${label} colour` : 'Choose colour'}
        className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
      />
      <input
        type="text"
        value={hexInput}
        onChange={(e) => handleHexChange(e.target.value)}
        onBlur={() => { if (!/^#[0-9a-fA-F]{6}$/.test(hexInput)) setHexInput(color) }}
        aria-label={label ? `${label} hex value` : 'Hex colour value'}
        className="w-24 h-10 rounded-lg border border-slate-300 px-2.5 text-sm font-mono text-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
        maxLength={7}
      />
    </div>
  )
}
