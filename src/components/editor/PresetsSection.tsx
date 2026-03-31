import { useMemo } from 'react'
import type { QROptions, DotStyle, CornerSquareStyle, CornerDotStyle, ColorConfig, CornerOptions } from '../../lib/qr-engine'
import { generateQRCode } from '../../lib/qr-engine'

interface Preset {
  name: string
  dotStyle: DotStyle
  cornerOptions: CornerOptions
  foregroundColor: ColorConfig
  backgroundColor: ColorConfig
}

const PRESETS: Preset[] = [
  {
    name: 'Minimal',
    dotStyle: 'square',
    cornerOptions: { squareStyle: 'square', dotStyle: 'square' },
    foregroundColor: { type: 'solid', color: '#000000' },
    backgroundColor: { type: 'solid', color: '#FFFFFF' },
  },
  {
    name: 'Bold',
    dotStyle: 'rounded',
    cornerOptions: { squareStyle: 'rounded', dotStyle: 'dot' },
    foregroundColor: { type: 'solid', color: '#2563eb' },
    backgroundColor: { type: 'solid', color: '#FFFFFF' },
  },
  {
    name: 'Gradient',
    dotStyle: 'rounded',
    cornerOptions: { squareStyle: 'extra-rounded', dotStyle: 'dot' },
    foregroundColor: {
      type: 'gradient',
      gradient: { type: 'linear', stops: [{ offset: 0, color: '#ec4899' }, { offset: 1, color: '#8b5cf6' }], rotation: 135 },
    },
    backgroundColor: { type: 'solid', color: '#FFFFFF' },
  },
  {
    name: 'Classic',
    dotStyle: 'classy-rounded',
    cornerOptions: { squareStyle: 'extra-rounded', dotStyle: 'dot' },
    foregroundColor: { type: 'solid', color: '#1e293b' },
    backgroundColor: { type: 'solid', color: '#FFFFFF' },
  },
]

const DOT_STYLES: DotStyle[] = ['square', 'rounded', 'dots', 'classy', 'classy-rounded']
const CORNER_SQUARE_STYLES: CornerSquareStyle[] = ['square', 'rounded', 'extra-rounded', 'dot', 'classy', 'dot-corners']
const CORNER_DOT_STYLES: CornerDotStyle[] = ['square', 'dot', 'diamond', 'heart']
const RANDOM_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e']

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface PresetsSectionProps {
  onApplyPreset: (options: Pick<QROptions, 'dotStyle' | 'cornerOptions' | 'foregroundColor' | 'backgroundColor'>) => void
}

export default function PresetsSection({ onApplyPreset }: PresetsSectionProps) {
  const previewSvgs = useMemo(() => {
    return PRESETS.map((p) =>
      generateQRCode({
        data: 'QR',
        size: 56,
        margin: 1,
        dotStyle: p.dotStyle,
        cornerOptions: p.cornerOptions,
        foregroundColor: p.foregroundColor,
        backgroundColor: p.backgroundColor,
      }).svg
    )
  }, [])

  function randomise() {
    const color1 = randomFrom(RANDOM_COLORS)
    let color2 = randomFrom(RANDOM_COLORS)
    while (color2 === color1) color2 = randomFrom(RANDOM_COLORS)

    const useGradient = Math.random() > 0.5
    onApplyPreset({
      dotStyle: randomFrom(DOT_STYLES),
      cornerOptions: {
        squareStyle: randomFrom(CORNER_SQUARE_STYLES),
        dotStyle: randomFrom(CORNER_DOT_STYLES),
      },
      foregroundColor: useGradient
        ? { type: 'gradient', gradient: { type: 'linear', stops: [{ offset: 0, color: color1 }, { offset: 1, color: color2 }], rotation: Math.floor(Math.random() * 360) } }
        : { type: 'solid', color: color1 },
      backgroundColor: { type: 'solid', color: '#FFFFFF' },
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Quick styles</span>
        <button
          type="button"
          onClick={randomise}
          className="text-[11px] font-medium text-brand-500 hover:text-brand-700 transition-colors cursor-pointer"
        >
          Randomise
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((preset, i) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onApplyPreset(preset)}
            className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-lg bg-slate-50 hover:bg-slate-100 active:bg-slate-200 transition-colors duration-150 cursor-pointer"
          >
            <div aria-hidden="true" className="w-12 h-12 [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: previewSvgs[i] }} />
            <span className="text-[10px] font-medium text-slate-500">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
