import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { QROptions, ColorConfig, CornerOptions, DotStyle, ErrorCorrectionLevel, LogoOptions } from '../lib/qr-engine'
import { generateQRCode } from '../lib/qr-engine'
import SEO from '../components/SEO'
import QRPreview from '../components/editor/QRPreview'
import ContentSection from '../components/editor/ContentSection'
import StyleSection from '../components/editor/StyleSection'
import ColorSection from '../components/editor/ColorSection'
import LogoSection from '../components/editor/LogoSection'
import AdvancedSection from '../components/editor/AdvancedSection'
import DownloadButton from '../components/editor/DownloadButton'
import PresetsSection from '../components/editor/PresetsSection'
import ShareButton from '../components/editor/ShareButton'
import { getHashState, setHashState } from '../lib/url-state'

const PREVIEW_URL = 'https://quirc.store/preview'

const DEFAULT_OPTIONS: QROptions = {
  data: PREVIEW_URL,
  dotStyle: 'rounded',
  cornerOptions: { squareStyle: 'rounded', dotStyle: 'dot' },
  foregroundColor: { type: 'solid', color: '#000000' },
  backgroundColor: { type: 'solid', color: '#FFFFFF' },
  errorCorrectionLevel: 'M',
  margin: 2,
  size: 300,
}

export default function Editor() {
  const [options, setOptions] = useState<QROptions>(() => {
    const fromHash = getHashState()
    return fromHash ? { ...DEFAULT_OPTIONS, ...fromHash } : DEFAULT_OPTIONS
  })

  // Sync options to URL hash (debounced)
  const hashTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    clearTimeout(hashTimerRef.current)
    hashTimerRef.current = setTimeout(() => setHashState(options), 500)
    return () => clearTimeout(hashTimerRef.current)
  }, [options])

  const qrResult = useMemo(() => generateQRCode({ ...options, data: PREVIEW_URL }), [options])

  const handleDataChange = useCallback((data: string) => {
    setOptions((prev) => ({ ...prev, data }))
  }, [])
  const handleDotStyleChange = useCallback((dotStyle: DotStyle) => {
    setOptions((prev) => ({ ...prev, dotStyle }))
  }, [])
  const handleCornerOptionsChange = useCallback((cornerOptions: CornerOptions) => {
    setOptions((prev) => ({ ...prev, cornerOptions }))
  }, [])
  const handleForegroundChange = useCallback((foregroundColor: ColorConfig) => {
    setOptions((prev) => ({ ...prev, foregroundColor }))
  }, [])
  const handleBackgroundChange = useCallback((backgroundColor: ColorConfig) => {
    setOptions((prev) => ({ ...prev, backgroundColor }))
  }, [])
  const handleLogoChange = useCallback((logo: LogoOptions | undefined) => {
    setOptions((prev) => {
      const next = { ...prev, logo }
      if (logo && (prev.errorCorrectionLevel === 'L' || prev.errorCorrectionLevel === 'M')) {
        next.errorCorrectionLevel = 'Q'
      }
      return next
    })
  }, [])
  const handleECLChange = useCallback((errorCorrectionLevel: ErrorCorrectionLevel) => {
    setOptions((prev) => ({ ...prev, errorCorrectionLevel }))
  }, [])
  const handleMarginChange = useCallback((margin: number) => {
    setOptions((prev) => ({ ...prev, margin }))
  }, [])
  const handleApplyPreset = useCallback((preset: Pick<QROptions, 'dotStyle' | 'cornerOptions' | 'foregroundColor' | 'backgroundColor'>) => {
    setOptions((prev) => ({ ...prev, ...preset }))
  }, [])

  return (
    <div className="h-full flex flex-col md:flex-row">
      <SEO
        title="QR Code Editor — Design Custom QR Codes | Quirc"
        description="Design a custom QR code with colors, rounded dots, logos, and frames. Live preview, instant download. $1.99 per code, no subscription."
        path="/editor"
      />
      <h1 className="sr-only">QR Code Editor — Design custom QR codes</h1>

      {/* ── Mobile: Compact Preview (sticky top) ─── */}
      <div className="shrink-0 md:hidden bg-slate-50 border-b border-slate-200 p-3">
        <div className="max-w-[160px] mx-auto">
          <QRPreview svg={qrResult.svg} />
        </div>
      </div>

      {/* ── Controls Panel ─── scrolls independently ─── */}
      <aside
        aria-label="QR code editor controls"
        className="min-h-0 flex-1 md:flex-none md:w-[360px] lg:w-[520px] xl:w-[560px] shrink-0 md:border-r border-slate-200 bg-white overflow-y-auto"
      >
        {/* Presets strip */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
          <PresetsSection onApplyPreset={handleApplyPreset} />
        </div>

        {/* Control groups separated by dividers */}
        <div className="px-5 py-4 space-y-1 divide-y divide-slate-100">
          <div className="pb-4">
            <ContentSection onDataChange={handleDataChange} />
          </div>
          <div className="py-4">
            <StyleSection
              dotStyle={options.dotStyle ?? 'rounded'}
              cornerOptions={options.cornerOptions ?? {}}
              margin={options.margin ?? 2}
              onDotStyleChange={handleDotStyleChange}
              onCornerOptionsChange={handleCornerOptionsChange}
              onMarginChange={handleMarginChange}
            />
          </div>
          <div className="py-4">
            <ColorSection
              foregroundColor={options.foregroundColor ?? { type: 'solid', color: '#000000' }}
              backgroundColor={options.backgroundColor ?? { type: 'solid', color: '#FFFFFF' }}
              onForegroundChange={handleForegroundChange}
              onBackgroundChange={handleBackgroundChange}
            />
          </div>
          <div className="py-4">
            <LogoSection logo={options.logo} onLogoChange={handleLogoChange} />
          </div>
          {/* Frame section — disabled pending further design work (QRC-28)
          <div className="py-4">
            <FrameSection frame={options.frame} onFrameChange={handleFrameChange} />
          </div>
          */}
          <div className="pt-4 pb-2">
            <AdvancedSection
              errorCorrectionLevel={options.errorCorrectionLevel ?? 'M'}
              hasLogo={!!options.logo}
              onECLChange={handleECLChange}
            />
          </div>
        </div>
      </aside>

      {/* ── Desktop/Tablet: Preview Canvas ─── does NOT scroll ─── */}
      <section
        aria-label="QR code preview"
        className="hidden md:flex flex-1 bg-slate-50 flex-col overflow-hidden"
      >
        {/* Centered QR preview */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 min-h-0">
          <div className="w-full max-w-[360px]">
            <QRPreview svg={qrResult.svg} />
          </div>
        </div>

        {/* Download bar — pinned to bottom */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-3">
          <div className="max-w-[360px] mx-auto space-y-2">
            <DownloadButton options={options} />
            <ShareButton hasLogo={!!options.logo} />
          </div>
        </div>
      </section>

      {/* ── Mobile: Download Bar (sticky bottom) ─── */}
      <div className="shrink-0 md:hidden border-t border-slate-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] space-y-2">
        <DownloadButton options={options} />
        <ShareButton hasLogo={!!options.logo} />
      </div>
    </div>
  )
}
