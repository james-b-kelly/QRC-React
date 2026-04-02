import { useEffect, useState } from 'react'
import type { ColorConfig, GradientConfig } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'
import ColorPicker from './ColorPicker'
import GradientPicker from './GradientPicker'

interface ColorPalette {
  name: string
  fg: ColorConfig
  bg: ColorConfig
  swatchColors: [string, string]
}

const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Ocean',
    fg: { type: 'solid', color: '#1d4ed8' },
    bg: { type: 'solid', color: '#FFFFFF' },
    swatchColors: ['#1d4ed8', '#FFFFFF'],
  },
  {
    name: 'Sunset',
    fg: { type: 'gradient', gradient: { type: 'linear', stops: [{ offset: 0, color: '#f97316' }, { offset: 1, color: '#ec4899' }], rotation: 135 } },
    bg: { type: 'solid', color: '#FFFFFF' },
    swatchColors: ['#f97316', '#ec4899'],
  },
  {
    name: 'Forest',
    fg: { type: 'solid', color: '#15803d' },
    bg: { type: 'solid', color: '#FFFFFF' },
    swatchColors: ['#15803d', '#FFFFFF'],
  },
  {
    name: 'Midnight',
    fg: { type: 'solid', color: '#e2e8f0' },
    bg: { type: 'solid', color: '#0f172a' },
    swatchColors: ['#e2e8f0', '#0f172a'],
  },
  {
    name: 'Berry',
    fg: { type: 'gradient', gradient: { type: 'linear', stops: [{ offset: 0, color: '#7c3aed' }, { offset: 1, color: '#db2777' }], rotation: 120 } },
    bg: { type: 'solid', color: '#FFFFFF' },
    swatchColors: ['#7c3aed', '#db2777'],
  },
  {
    name: 'Ember',
    fg: { type: 'solid', color: '#dc2626' },
    bg: { type: 'solid', color: '#FFFFFF' },
    swatchColors: ['#dc2626', '#FFFFFF'],
  },
  {
    name: 'Mint',
    fg: { type: 'solid', color: '#0d9488' },
    bg: { type: 'solid', color: '#f0fdfa' },
    swatchColors: ['#0d9488', '#f0fdfa'],
  },
  {
    name: 'Noir',
    fg: { type: 'solid', color: '#FFFFFF' },
    bg: { type: 'solid', color: '#1e293b' },
    swatchColors: ['#FFFFFF', '#1e293b'],
  },
]

interface ColorSectionProps {
  foregroundColor: ColorConfig
  backgroundColor: ColorConfig
  onForegroundChange: (color: ColorConfig) => void
  onBackgroundChange: (color: ColorConfig) => void
}

const DEFAULT_GRADIENT: GradientConfig = {
  type: 'linear',
  stops: [{ offset: 0, color: '#000000' }, { offset: 1, color: '#2563eb' }],
  rotation: 45,
}

export default function ColorSection({ foregroundColor, backgroundColor, onForegroundChange, onBackgroundChange }: ColorSectionProps) {
  const [fgMode, setFgMode] = useState<'solid' | 'gradient'>(foregroundColor.type)
  const [savedGradient, setSavedGradient] = useState<GradientConfig>(foregroundColor.gradient ?? DEFAULT_GRADIENT)
  const isTransparent = backgroundColor.type === 'solid' && backgroundColor.color === 'transparent'

  useEffect(() => {
    setFgMode(foregroundColor.type)
    if (foregroundColor.type === 'gradient' && foregroundColor.gradient) {
      setSavedGradient(foregroundColor.gradient)
    }
  }, [foregroundColor])

  function toggleFgMode(mode: 'solid' | 'gradient') {
    setFgMode(mode)
    if (mode === 'solid') {
      onForegroundChange({ type: 'solid', color: foregroundColor.color ?? '#000000' })
    } else {
      onForegroundChange({ type: 'gradient', gradient: savedGradient })
    }
  }

  function handleGradientChange(gradient: GradientConfig) {
    setSavedGradient(gradient)
    onForegroundChange({ type: 'gradient', gradient })
  }

  return (
    <SectionWrapper title="Colours">
      <div className="space-y-5">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Palettes</p>
          <div className="flex gap-1.5 flex-wrap">
            {COLOR_PALETTES.map((palette) => (
              <button
                key={palette.name}
                type="button"
                title={palette.name}
                onClick={() => {
                  onForegroundChange(palette.fg)
                  onBackgroundChange(palette.bg)
                }}
                className="flex items-center gap-0 w-8 h-5 rounded-full overflow-hidden border border-slate-200 hover:border-slate-400 hover:scale-110 transition-all duration-150 cursor-pointer"
              >
                <span className="w-1/2 h-full" style={{ backgroundColor: palette.swatchColors[0] }} />
                <span className="w-1/2 h-full" style={{ backgroundColor: palette.swatchColors[1] }} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500">Foreground</p>
            <div className="flex gap-1" role="radiogroup" aria-label="Foreground colour mode">
              <button
                type="button"
                role="radio"
                aria-checked={fgMode === 'solid'}
                onClick={() => toggleFgMode('solid')}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${fgMode === 'solid' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-slate-300 text-slate-500 hover:border-slate-400'}`}
              >
                Solid
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={fgMode === 'gradient'}
                onClick={() => toggleFgMode('gradient')}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${fgMode === 'gradient' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-slate-300 text-slate-500 hover:border-slate-400'}`}
              >
                Gradient
              </button>
            </div>
          </div>

          {fgMode === 'solid' ? (
            <ColorPicker
              color={foregroundColor.color ?? '#000000'}
              onChange={(c) => onForegroundChange({ type: 'solid', color: c })}
            />
          ) : (
            <GradientPicker gradient={savedGradient} onChange={handleGradientChange} />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500">Background</p>
            <label className="flex items-center gap-2 min-h-[44px] text-xs font-medium text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={isTransparent}
                onChange={(e) => {
                  onBackgroundChange(
                    e.target.checked
                      ? { type: 'solid', color: 'transparent' }
                      : { type: 'solid', color: '#FFFFFF' }
                  )
                }}
                className="w-5 h-5 rounded border-slate-300"
              />
              Transparent
            </label>
          </div>
          {!isTransparent && (
            <ColorPicker
              color={backgroundColor.color ?? '#FFFFFF'}
              onChange={(c) => onBackgroundChange({ type: 'solid', color: c })}
            />
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
