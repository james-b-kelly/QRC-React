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
    foregroundColor: { type: 'solid', color: '#4f46e5' },
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
const CORNER_SQUARE_STYLES: CornerSquareStyle[] = ['square', 'rounded', 'extra-rounded', 'dot']
const CORNER_DOT_STYLES: CornerDotStyle[] = ['square', 'dot']
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
        size: 48,
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700">Quick styles</p>
        <button
          type="button"
          onClick={randomise}
          className="px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Randomise
        </button>
      </div>
      <div className="flex gap-2">
        {PRESETS.map((preset, i) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onApplyPreset(preset)}
            className="flex flex-col items-center gap-1 p-1.5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer flex-1"
          >
            <div className="w-12 h-12 rounded overflow-hidden" dangerouslySetInnerHTML={{ __html: previewSvgs[i] }} />
            <span className="text-[10px] text-gray-500">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
