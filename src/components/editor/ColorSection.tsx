import { useEffect, useState } from 'react'
import type { ColorConfig, GradientConfig } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'
import ColorPicker from './ColorPicker'
import GradientPicker from './GradientPicker'

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
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-slate-500">Foreground</p>
            <div className="flex gap-1" role="radiogroup" aria-label="Foreground colour mode">
              <button
                type="button"
                role="radio"
                aria-checked={fgMode === 'solid'}
                onClick={() => toggleFgMode('solid')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors cursor-pointer ${fgMode === 'solid' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-slate-300 text-slate-500 hover:border-slate-400'}`}
              >
                Solid
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={fgMode === 'gradient'}
                onClick={() => toggleFgMode('gradient')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors cursor-pointer ${fgMode === 'gradient' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-slate-300 text-slate-500 hover:border-slate-400'}`}
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
            <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 cursor-pointer">
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
                className="rounded border-slate-300"
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
