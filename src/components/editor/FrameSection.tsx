import type { FrameOptions, FrameStyle } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'
import ColorPicker from './ColorPicker'

const FRAME_STYLES: { value: FrameStyle; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'banner-bottom', label: 'Banner ↓' },
  { value: 'banner-top', label: 'Banner ↑' },
  { value: 'rounded-border', label: 'Border' },
  { value: 'pill-label', label: 'Pill' },
]

interface FrameSectionProps {
  frame: FrameOptions | undefined
  onFrameChange: (frame: FrameOptions | undefined) => void
}

export default function FrameSection({ frame, onFrameChange }: FrameSectionProps) {
  const currentStyle = frame?.style ?? 'none'
  const currentText = frame?.text ?? 'SCAN ME'
  const currentFrameColor = frame?.frameColor ?? '#000000'
  const currentTextColor = frame?.textColor ?? '#FFFFFF'

  function handleStyleChange(style: FrameStyle) {
    if (style === 'none') {
      onFrameChange(undefined)
    } else {
      onFrameChange({ style, text: currentText, frameColor: currentFrameColor, textColor: currentTextColor })
    }
  }

  function handleTextChange(text: string) {
    if (!frame) return
    onFrameChange({ ...frame, text })
  }

  function handleFrameColorChange(frameColor: string) {
    if (!frame) return
    onFrameChange({ ...frame, frameColor })
  }

  function handleTextColorChange(textColor: string) {
    if (!frame) return
    onFrameChange({ ...frame, textColor })
  }

  return (
    <SectionWrapper title="Frame" defaultOpen={false}>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2.5">Style</p>
          <div className="flex flex-wrap gap-2">
            {FRAME_STYLES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => handleStyleChange(s.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  currentStyle === s.value
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {currentStyle !== 'none' && (
          <>
            <div>
              <label htmlFor="frame-text" className="block text-xs font-medium text-slate-500 mb-1.5">Text</label>
              <input
                id="frame-text"
                type="text"
                value={currentText}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
                maxLength={30}
                placeholder="SCAN ME"
              />
            </div>
            <ColorPicker color={currentFrameColor} onChange={handleFrameColorChange} label="Frame" />
            <ColorPicker color={currentTextColor} onChange={handleTextColorChange} label="Text" />
          </>
        )}
      </div>
    </SectionWrapper>
  )
}
