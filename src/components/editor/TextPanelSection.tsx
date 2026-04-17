import { useState } from 'react'
import type { TextPanelOptions, ContainerOptions, TextPosition } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'
import ColorPicker from './ColorPicker'

const POSITIONS: { value: TextPosition; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
]

const FONTS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Bebas Neue', label: 'Bebas Neue' },
  { value: 'Righteous', label: 'Righteous' },
  { value: 'Pacifico', label: 'Pacifico' },
  { value: 'Permanent Marker', label: 'Permanent Marker' },
  { value: 'Space Mono', label: 'Space Mono' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
]

interface TextPanelSectionProps {
  panel: TextPanelOptions | undefined
  container: ContainerOptions | undefined
  onPanelChange: (panel: TextPanelOptions | undefined) => void
  onContainerChange: (container: ContainerOptions) => void
}

export default function TextPanelSection({ panel, container, onPanelChange, onContainerChange }: TextPanelSectionProps) {
  const [showMoreOptions, setShowMoreOptions] = useState(false)

  const hasText = !!panel?.text.trim()

  function update(updates: Partial<TextPanelOptions>) {
    if (!panel) {
      onPanelChange({ text: '', position: 'bottom', ...updates })
    } else {
      onPanelChange({ ...panel, ...updates })
    }
  }

  function handleTextChange(text: string) {
    if (!panel) {
      onPanelChange({ text, position: 'bottom' })
    } else {
      onPanelChange({ ...panel, text })
    }
  }

  function handleClear() {
    onPanelChange(undefined)
    setShowMoreOptions(false)
  }

  return (
    <SectionWrapper title="Text" defaultOpen={false}>
      <div className="space-y-3">
        {/* Text input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-500">Text</label>
            {panel && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            value={panel?.text ?? ''}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors resize-none"
            placeholder="Enter text..."
          />
        </div>

        {/* Position selector */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Position</label>
          <div className="flex gap-1.5">
            {POSITIONS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => update({ position: p.value })}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  (panel?.position ?? 'bottom') === p.value
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font & size */}
        <div className="flex gap-2.5">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">Font</label>
            <select
              value={panel?.font ?? 'Arial'}
              onChange={(e) => update({ font: e.target.value })}
              className="w-full h-10 rounded-lg border border-slate-300 px-2.5 text-sm text-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div className="w-24 shrink-0">
            <label className="block text-xs font-medium text-slate-500 mb-1">Size</label>
            <input
              type="range"
              min={0.04}
              max={0.5}
              step={0.01}
              value={panel?.fontSize ?? 0.08}
              onChange={(e) => update({ fontSize: parseFloat(e.target.value) })}
              className="w-full mt-2.5"
            />
          </div>
        </div>

        {/* Text color */}
        <ColorPicker
          color={panel?.textColor ?? '#000000'}
          onChange={(textColor) => update({ textColor })}
          label="Color"
        />

        {/* More options toggle */}
        <button
          type="button"
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors"
        >
          {showMoreOptions ? 'Less options' : 'More options'}
        </button>

        {showMoreOptions && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Weight</label>
              <div className="flex gap-1.5">
                {([['400', 'Normal'], ['600', 'Semi'], ['700', 'Bold']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => update({ fontWeight: val })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      (panel?.fontWeight ?? '600') === val
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Alignment</label>
              <div className="flex gap-1.5">
                {([
                  ['left', <><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h10M3 18h14" /></>],
                  ['center', <><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M5 18h14" /></>],
                  ['right', <><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M11 12h10M7 18h14" /></>],
                ] as const).map(([val, icon]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => update({ alignment: val as 'left' | 'center' | 'right' })}
                    aria-label={`Align ${val}`}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      (panel?.alignment ?? 'center') === val
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Line spacing</span>
                <span>{panel?.lineSpacing ?? 100}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={200}
                step={5}
                value={panel?.lineSpacing ?? 100}
                onChange={(e) => update({ lineSpacing: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Padding</span>
                <span>{Math.round((panel?.padding ?? 0.04) * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.01}
                max={0.10}
                step={0.005}
                value={panel?.padding ?? 0.04}
                onChange={(e) => update({ padding: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Container controls */}
        {hasText && (
          <div className="border-t border-slate-100 pt-3 mt-3 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Container</p>
            <ColorPicker
              color={container?.backgroundColor ?? '#FFFFFF'}
              onChange={(backgroundColor) => onContainerChange({ ...container, backgroundColor })}
              label="Background"
            />
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Opacity</span>
                <span>{Math.round((container?.backgroundOpacity ?? 1) * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={container?.backgroundOpacity ?? 1}
                onChange={(e) => onContainerChange({ ...container, backgroundOpacity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Corner radius</span>
                <span>{Math.round((container?.cornerRadius ?? 0) * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.15}
                step={0.005}
                value={container?.cornerRadius ?? 0}
                onChange={(e) => onContainerChange({ ...container, cornerRadius: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Border</span>
                <span>{Math.round((container?.borderWidth ?? 0) * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.10}
                step={0.004}
                value={container?.borderWidth ?? 0}
                onChange={(e) => onContainerChange({ ...container, borderWidth: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            {(container?.borderWidth ?? 0) > 0 && (
              <ColorPicker
                color={container?.borderColor ?? '#000000'}
                onChange={(borderColor) => onContainerChange({ ...container, borderColor })}
                label="Border"
              />
            )}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Padding</span>
                <span>{Math.round((container?.padding ?? 0) * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.10}
                step={0.005}
                value={container?.padding ?? 0}
                onChange={(e) => onContainerChange({ ...container, padding: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
