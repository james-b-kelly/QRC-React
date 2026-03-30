import { useId, useMemo } from 'react'

interface QRPreviewProps {
  svg: string
}

export default function QRPreview({ svg }: QRPreviewProps) {
  const instanceId = useId().replace(/:/g, '')

  // Replace gradient IDs to avoid duplicate-ID conflicts when multiple
  // QRPreview instances are in the DOM simultaneously (e.g. mobile + desktop).
  const uniqueSvg = useMemo(() => {
    return svg.replace(/id="(fg|cs|cd|bg)-/g, `id="$1-${instanceId}-`)
              .replace(/url\(#(fg|cs|cd|bg)-/g, `url(#$1-${instanceId}-`)
  }, [svg, instanceId])

  return (
    <div
      role="img"
      aria-label="QR code preview"
      className="w-full aspect-square rounded-2xl bg-white shadow-lg ring-1 ring-black/5 [&>svg]:w-full [&>svg]:h-full [&>svg]:rounded-2xl"
      dangerouslySetInnerHTML={{ __html: uniqueSvg }}
    />
  )
}
