import { useState } from 'react'
import type { TextPanelOptions, ContainerOptions, TextPosition } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'
import ColorPicker from './ColorPicker'
import SliderRow from './SliderRow'

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
        {/* ── Text input ── */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-500">Text</label>
            {panel && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
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

        {/* ── Position ── */}
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

        {/* ── Typography card ── */}
        <div className="rounded-lg bg-slate-50 p-3 space-y-2.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Typography</p>

          {/* Font + Size row */}
          <div className="flex gap-2">
            <select
              value={panel?.font ?? 'Arial'}
              onChange={(e) => update({ font: e.target.value })}
              className="flex-1 h-9 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            {/* Weight + Alignment inline */}
            <div className="flex gap-0.5 bg-white rounded-md border border-slate-200 p-0.5">
              {([['400', 'Regular'], ['600', 'Medium'], ['700', 'Bold']] as const).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => update({ fontWeight: val })}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    (panel?.fontWeight ?? '600') === val
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Size slider + Alignment */}
          <div className="flex items-center gap-2">
            <SliderRow
              label="Size"
              value={panel?.fontSize ?? 0.08}
              displayValue={`${Math.round((panel?.fontSize ?? 0.08) * 100)}%`}
              min={0.04}
              max={0.5}
              step={0.01}
              onChange={(v) => update({ fontSize: v })}
            />
          </div>

          {/* Color + Alignment row */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ColorPicker
                color={panel?.textColor ?? '#000000'}
                onChange={(textColor) => update({ textColor })}
              />
            </div>
            <div className="flex gap-0.5 bg-white rounded-md border border-slate-200 p-0.5 shrink-0">
              {([
                ['left', <path key="l" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h10M3 18h14" />],
                ['center', <path key="c" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M5 18h14" />],
                ['right', <path key="r" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M11 12h10M7 18h14" />],
              ] as const).map(([val, icon]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => update({ alignment: val as 'left' | 'center' | 'right' })}
                  aria-label={`Align ${val}`}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    (panel?.alignment ?? 'center') === val
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── More options ── */}
        <button
          type="button"
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors cursor-pointer"
        >
          {showMoreOptions ? 'Less options' : 'More options'}
        </button>

        {showMoreOptions && (
          <div className="rounded-lg bg-slate-50 p-3 space-y-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Layout</p>
            <SliderRow
              label="Spacing"
              value={panel?.lineSpacing ?? 100}
              displayValue={`${panel?.lineSpacing ?? 100}%`}
              min={50}
              max={200}
              step={5}
              onChange={(v) => update({ lineSpacing: v })}
            />
            <SliderRow
              label="Padding"
              value={panel?.padding ?? 0.04}
              displayValue={`${Math.round((panel?.padding ?? 0.04) * 100)}%`}
              min={0.01}
              max={0.10}
              step={0.005}
              onChange={(v) => update({ padding: v })}
            />
          </div>
        )}

        {/* ── Container card ── */}
        {hasText && (
          <div className="rounded-lg bg-slate-50 p-3 space-y-2.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Container</p>

            <ColorPicker
              color={container?.backgroundColor ?? '#FFFFFF'}
              onChange={(backgroundColor) => onContainerChange({ ...container, backgroundColor })}
              label="Fill"
            />

            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <SliderRow
                label="Opacity"
                value={container?.backgroundOpacity ?? 1}
                displayValue={`${Math.round((container?.backgroundOpacity ?? 1) * 100)}%`}
                min={0}
                max={1}
                step={0.05}
                onChange={(v) => onContainerChange({ ...container, backgroundOpacity: v })}
              />
              <SliderRow
                label="Radius"
                value={container?.cornerRadius ?? 0}
                displayValue={`${Math.round((container?.cornerRadius ?? 0) * 100)}%`}
                min={0}
                max={0.15}
                step={0.005}
                onChange={(v) => onContainerChange({ ...container, cornerRadius: v })}
              />
              <SliderRow
                label="Border"
                value={container?.borderWidth ?? 0}
                displayValue={`${Math.round((container?.borderWidth ?? 0) * 100)}%`}
                min={0}
                max={0.10}
                step={0.004}
                onChange={(v) => onContainerChange({ ...container, borderWidth: v })}
              />
              <SliderRow
                label="Padding"
                value={container?.padding ?? 0}
                displayValue={`${Math.round((container?.padding ?? 0) * 100)}%`}
                min={0}
                max={0.10}
                step={0.005}
                onChange={(v) => onContainerChange({ ...container, padding: v })}
              />
            </div>

            {(container?.borderWidth ?? 0) > 0 && (
              <ColorPicker
                color={container?.borderColor ?? '#000000'}
                onChange={(borderColor) => onContainerChange({ ...container, borderColor })}
                label="Stroke"
              />
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
