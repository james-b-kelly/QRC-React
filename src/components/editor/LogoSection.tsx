import { useCallback, useRef, useState } from 'react'
import type { LogoOptions } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'
import SliderRow from './SliderRow'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

interface LogoSectionProps {
  logo: LogoOptions | undefined
  onLogoChange: (logo: LogoOptions | undefined) => void
}

export default function LogoSection({ logo, onLogoChange }: LogoSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    setError(undefined)
    if (!file.type.startsWith('image/')) { setError('Please upload an image file.'); return }
    if (file.size > MAX_FILE_SIZE) { setError('Image must be under 2MB.'); return }
    const reader = new FileReader()
    reader.onload = () => {
      onLogoChange({
        src: reader.result as string,
        sizeRatio: 0.25,
        padding: 1,
      })
    }
    reader.readAsDataURL(file)
  }, [onLogoChange])

  return (
    <SectionWrapper title="Logo" defaultOpen={false}>
      <div className="space-y-3">
        {!logo?.src ? (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                const file = e.dataTransfer.files[0]
                if (file) handleFile(file)
              }}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click() } }}
              role="button"
              tabIndex={0}
              aria-label="Upload logo image"
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors min-h-[80px] flex items-center justify-center ${
                isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div>
                <p className="text-sm text-slate-500">
                  <span className="hidden sm:inline">Drop an image here or click to browse</span>
                  <span className="sm:hidden">Tap to upload an image</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, SVG — max 2MB</p>
                {error && <p className="text-xs text-red-600 mt-2" role="alert">{error}</p>}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={logo.src} alt="Uploaded logo" className="w-12 h-12 rounded-lg object-contain border border-slate-200" />
              <button
                type="button"
                onClick={() => onLogoChange(undefined)}
                className="text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer"
              >
                Remove
              </button>
            </div>

            <SliderRow
              label="Size"
              value={Math.round((logo.sizeRatio ?? 0.25) * 100)}
              displayValue={`${Math.round((logo.sizeRatio ?? 0.25) * 100)}%`}
              min={10}
              max={35}
              step={1}
              onChange={(v) => onLogoChange({ ...logo, sizeRatio: v / 100 })}
              id="logo-size"
            />
            <SliderRow
              label="Padding"
              value={logo.padding ?? 1}
              displayValue={`${logo.padding ?? 1}`}
              min={0}
              max={3}
              step={1}
              onChange={(v) => onLogoChange({ ...logo, padding: v })}
              id="logo-padding"
            />

            <p className="text-[11px] text-amber-600">Error correction is auto-adjusted when a logo is present.</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
