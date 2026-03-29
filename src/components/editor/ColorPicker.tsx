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
    <div className="flex items-center gap-2">
      {label && <span className="text-xs font-medium text-gray-500 w-16 shrink-0">{label}</span>}
      <input
        type="color"
        value={color}
        onChange={(e) => handleNativeChange(e.target.value)}
        className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5"
      />
      <input
        type="text"
        value={hexInput}
        onChange={(e) => handleHexChange(e.target.value)}
        onBlur={() => { if (!/^#[0-9a-fA-F]{6}$/.test(hexInput)) setHexInput(color) }}
        className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
        maxLength={7}
      />
    </div>
  )
}
