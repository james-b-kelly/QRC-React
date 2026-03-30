import { useMemo } from 'react'
import { generateQRCode } from '../../lib/qr-engine'
import type { QROptions } from '../../lib/qr-engine'

interface StyleOptionProps {
  label: string
  selected: boolean
  onClick: () => void
  previewOptions: Partial<QROptions>
}

export default function StyleOption({ label, selected, onClick, previewOptions }: StyleOptionProps) {
  const svg = useMemo(() => {
    const result = generateQRCode({
      data: 'QR',
      size: 56,
      margin: 1,
      foregroundColor: { type: 'solid', color: '#1e293b' },
      backgroundColor: { type: 'solid', color: '#FFFFFF' },
      ...previewOptions,
    })
    return result.svg
  }, [previewOptions])

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:outline-none ${
        selected
          ? 'border-brand-500 bg-brand-50 shadow-sm'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div
        aria-hidden="true"
        className="w-14 h-14 [&>svg]:w-full [&>svg]:h-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <span className="text-[11px] font-medium text-slate-600 leading-tight">{label}</span>
    </button>
  )
}
