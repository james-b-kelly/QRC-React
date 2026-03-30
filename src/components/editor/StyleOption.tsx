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
      size: 48,
      margin: 1,
      foregroundColor: { type: 'solid', color: '#000000' },
      backgroundColor: { type: 'solid', color: '#FFFFFF' },
      ...previewOptions,
    })
    return result.svg
  }, [previewOptions])

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border-2 transition-colors cursor-pointer ${
        selected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div
        className="w-12 h-12 rounded overflow-hidden"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <span className="text-[10px] text-gray-500 leading-tight">{label}</span>
    </button>
  )
}
