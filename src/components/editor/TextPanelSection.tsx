import { useState } from 'react'
import type { TextPanelOptions, ContainerOptions, TextPosition } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'
import ColorPicker from './ColorPicker'

const POSITIONS: { value: TextPosition; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'right', label: 'Right' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
]

const FONTS = [
  // Sans-serif
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Oswald', label: 'Oswald' },
  // Serif
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Lora', label: 'Lora' },
  // Display
  { value: 'Bebas Neue', label: 'Bebas Neue' },
  { value: 'Righteous', label: 'Righteous' },
  { value: 'Pacifico', label: 'Pacifico' },
  { value: 'Permanent Marker', label: 'Permanent Marker' },
  // Mono
  { value: 'Space Mono', label: 'Space Mono' },
  // System
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
]

const DISPLAY_ORDER: TextPosition[] = ['top', 'right', 'bottom', 'left']

interface TextPanelSectionProps {
  panels: TextPanelOptions[]
  container: ContainerOptions | undefined
  onPanelsChange: (panels: TextPanelOptions[]) => void
  onContainerChange: (container: ContainerOptions) => void
}

export default function TextPanelSection({ panels, container, onPanelsChange, onContainerChange }: TextPanelSectionProps) {
  const [expandedPosition, setExpandedPosition] = useState<TextPosition | null>(null)
  const [showMoreOptions, setShowMoreOptions] = useState<Set<TextPosition>>(new Set())

  const usedPositions = new Set(panels.map((p) => p.position))
  const sortedPanels = [...panels].sort(
    (a, b) => DISPLAY_ORDER.indexOf(a.position) - DISPLAY_ORDER.indexOf(b.position)
  )
  const hasActivePanels = panels.some((p) => p.text.trim())

  function addPanel(position: TextPosition) {
    const newPanel: TextPanelOptions = { text: '', position }
    onPanelsChange([...panels, newPanel])
    setExpandedPosition(position)
  }

  function removePanel(position: TextPosition) {
    onPanelsChange(panels.filter((p) => p.position !== position))
    if (expandedPosition === position) setExpandedPosition(null)
  }

  function updatePanel(position: TextPosition, updates: Partial<TextPanelOptions>) {
    onPanelsChange(panels.map((p) => p.position === position ? { ...p, ...updates } : p))
  }

  function toggleMoreOptions(position: TextPosition) {
    setShowMoreOptions((prev) => {
      const next = new Set(prev)
      if (next.has(position)) next.delete(position)
      else next.add(position)
      return next
    })
  }

  return (
    <SectionWrapper title="Text" defaultOpen={false}>
      <div className="space-y-3">
        {/* Panel list */}
        {sortedPanels.map((panel) => {
          const isExpanded = expandedPosition === panel.position
          const hasMore = showMoreOptions.has(panel.position)

          return (
            <div key={panel.position} className="border border-slate-200 rounded-lg overflow-hidden">
              {/* Panel header */}
              <button
                type="button"
                onClick={() => setExpandedPosition(isExpanded ? null : panel.position)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors min-h-[44px]"
              >
                <span className="text-xs font-semibold text-slate-600 capitalize">{panel.position} text</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removePanel(panel.position) }}
                    className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${panel.position} text panel`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <svg
                    className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Panel controls */}
              {isExpanded && (
                <div className="px-3 py-3 space-y-3">
                  {/* Primary controls — always visible */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Text</label>
                    <textarea
                      value={panel.text}
                      onChange={(e) => updatePanel(panel.position, { text: e.target.value })}
                      rows={2}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors resize-none"
                      placeholder="Enter text..."
                    />
                  </div>

                  <div className="flex gap-2.5">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Font</label>
                      <select
                        value={panel.font ?? 'Arial'}
                        onChange={(e) => updatePanel(panel.position, { font: e.target.value })}
                        className="w-full h-10 rounded-lg border border-slate-300 px-2.5 text-sm text-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
                      >
                        {FONTS.map((f) => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24 shrink-0">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Size</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="range"
                          min={0.04}
                          max={0.5}
                          step={0.01}
                          value={panel.fontSize ?? 0.08}
                          onChange={(e) => updatePanel(panel.position, { fontSize: parseFloat(e.target.value) })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <ColorPicker
                    color={panel.textColor ?? '#000000'}
                    onChange={(textColor) => updatePanel(panel.position, { textColor })}
                    label="Color"
                  />

                  {/* Secondary controls — behind toggle */}
                  <button
                    type="button"
                    onClick={() => toggleMoreOptions(panel.position)}
                    className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors"
                  >
                    {hasMore ? 'Less options' : 'More options'}
                  </button>

                  {hasMore && (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Weight</label>
                        <div className="flex gap-1.5">
                          {([['400', 'Normal'], ['600', 'Semi'], ['700', 'Bold']] as const).map(([val, label]) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => updatePanel(panel.position, { fontWeight: val })}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                (panel.fontWeight ?? '600') === val
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
                          {([['left', 'L'], ['center', 'C'], ['right', 'R']] as const).map(([val, label]) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => updatePanel(panel.position, { alignment: val })}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                (panel.alignment ?? 'center') === val
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
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                          <span>Line spacing</span>
                          <span>{panel.lineSpacing ?? 100}%</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={200}
                          step={5}
                          value={panel.lineSpacing ?? 100}
                          onChange={(e) => updatePanel(panel.position, { lineSpacing: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                          <span>Padding</span>
                          <span>{Math.round((panel.padding ?? 0.04) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min={0.01}
                          max={0.10}
                          step={0.005}
                          value={panel.padding ?? 0.04}
                          onChange={(e) => updatePanel(panel.position, { padding: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Add panel button */}
        {panels.length < 4 && (
          <div className="flex flex-wrap gap-1.5">
            {POSITIONS.filter((p) => !usedPositions.has(p.value)).map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => addPanel(p.value)}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                + {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Container controls */}
        {hasActivePanels && (
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
                max={0.05}
                step={0.002}
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
