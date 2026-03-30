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
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={downloadSVG}
        className="flex-1 h-11 rounded-lg bg-cta text-white font-semibold text-sm shadow-md shadow-orange-500/20 hover:bg-cta-hover active:scale-[0.98] transition-all cursor-pointer"
      >
        Download — $1.99
      </button>
      <button
        type="button"
        onClick={downloadPNG}
        disabled={downloading}
        className="h-11 px-4 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {downloading ? '...' : 'PNG'}
      </button>
      <button
        type="button"
        onClick={downloadSVG}
        className="h-11 px-4 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
      >
        SVG
      </button>
    </div>
  )
}
