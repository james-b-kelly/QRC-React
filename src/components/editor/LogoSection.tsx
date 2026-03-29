import { useCallback, useRef, useState } from 'react'
import type { LogoOptions } from '../../lib/qr-engine'
import SectionWrapper from './SectionWrapper'

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
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <p className="text-sm text-gray-500">Drop an image here or click to browse</p>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
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
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={logo.src} alt="Logo" className="w-12 h-12 rounded object-contain border border-gray-200" />
              <button
                type="button"
                onClick={() => onLogoChange(undefined)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div>
              <label className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Size</span>
                <span>{Math.round((logo.sizeRatio ?? 0.25) * 100)}%</span>
              </label>
              <input
                type="range"
                min={10}
                max={35}
                value={Math.round((logo.sizeRatio ?? 0.25) * 100)}
                onChange={(e) => onLogoChange({ ...logo, sizeRatio: Number(e.target.value) / 100 })}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Padding</span>
                <span>{logo.padding ?? 1} modules</span>
              </label>
              <input
                type="range"
                min={0}
                max={3}
                value={logo.padding ?? 1}
                onChange={(e) => onLogoChange({ ...logo, padding: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <p className="text-[10px] text-amber-600">Error correction is auto-adjusted when a logo is present.</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
