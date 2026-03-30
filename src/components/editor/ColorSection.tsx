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
  stops: [{ offset: 0, color: '#000000' }, { offset: 1, color: '#4f46e5' }],
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
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500">Foreground</p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => toggleFgMode('solid')}
                className={`px-2 py-0.5 text-[10px] rounded-full border ${fgMode === 'solid' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300 text-gray-500'}`}
              >
                Solid
              </button>
              <button
                type="button"
                onClick={() => toggleFgMode('gradient')}
                className={`px-2 py-0.5 text-[10px] rounded-full border ${fgMode === 'gradient' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300 text-gray-500'}`}
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
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500">Background</p>
            <label className="flex items-center gap-1.5 text-[10px] text-gray-500">
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
                className="rounded"
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
