import { useState } from 'react'
import type { QRResult } from '../../lib/qr-engine'

interface DownloadButtonProps {
  qrResult: QRResult
}

export default function DownloadButton({ qrResult }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)

  function downloadSVG() {
    const blob = new Blob([qrResult.svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qr-code.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function downloadPNG() {
    setDownloading(true)
    try {
      const blob = await qrResult.toPNG(1024)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'qr-code.png'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={downloadSVG}
        className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors cursor-pointer"
      >
        Download SVG
      </button>
      <button
        type="button"
        onClick={downloadPNG}
        disabled={downloading}
        className="w-full py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {downloading ? 'Generating PNG...' : 'Download PNG (1024px)'}
      </button>
      <p className="text-[10px] text-center text-gray-400">Stripe payment coming soon — downloads are free for now</p>
    </div>
  )
}
