import { useCallback, useMemo, useState } from 'react'
import type { QROptions, ColorConfig, CornerOptions, DotStyle, ErrorCorrectionLevel, LogoOptions } from '../lib/qr-engine'
import { generateQRCode } from '../lib/qr-engine'
import QRPreview from '../components/editor/QRPreview'
import ContentSection from '../components/editor/ContentSection'
import StyleSection from '../components/editor/StyleSection'
import ColorSection from '../components/editor/ColorSection'
import LogoSection from '../components/editor/LogoSection'
import AdvancedSection from '../components/editor/AdvancedSection'
import DownloadButton from '../components/editor/DownloadButton'
import PresetsSection from '../components/editor/PresetsSection'

const DEFAULT_OPTIONS: QROptions = {
  data: 'https://example.com',
  dotStyle: 'rounded',
  cornerOptions: { squareStyle: 'rounded', dotStyle: 'dot' },
  foregroundColor: { type: 'solid', color: '#000000' },
  backgroundColor: { type: 'solid', color: '#FFFFFF' },
  errorCorrectionLevel: 'M',
  margin: 2,
  size: 300,
}

export default function Editor() {
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS)

  const qrResult = useMemo(() => generateQRCode(options), [options])

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
    setOptions((prev) => ({ ...prev, logo }))
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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-8">
        {/* Preview — sticky on mobile, right column on desktop */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-6">
            <QRPreview svg={qrResult.svg} />
            <div className="px-6 mt-4">
              <DownloadButton qrResult={qrResult} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="order-2 lg:order-1 space-y-4">
          <PresetsSection onApplyPreset={handleApplyPreset} />

          <ContentSection onDataChange={handleDataChange} />

          <StyleSection
            dotStyle={options.dotStyle ?? 'rounded'}
            cornerOptions={options.cornerOptions ?? {}}
            onDotStyleChange={handleDotStyleChange}
            onCornerOptionsChange={handleCornerOptionsChange}
          />

          <ColorSection
            foregroundColor={options.foregroundColor ?? { type: 'solid', color: '#000000' }}
            backgroundColor={options.backgroundColor ?? { type: 'solid', color: '#FFFFFF' }}
            onForegroundChange={handleForegroundChange}
            onBackgroundChange={handleBackgroundChange}
          />

          <LogoSection logo={options.logo} onLogoChange={handleLogoChange} />

          <AdvancedSection
            errorCorrectionLevel={options.errorCorrectionLevel ?? 'M'}
            margin={options.margin ?? 2}
            hasLogo={!!options.logo}
            onECLChange={handleECLChange}
            onMarginChange={handleMarginChange}
          />
        </div>
      </div>
    </div>
  )
}
