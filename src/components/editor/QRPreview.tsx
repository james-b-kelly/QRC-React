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
      className="w-full [&>svg]:w-full [&>svg]:h-full"
      dangerouslySetInnerHTML={{ __html: uniqueSvg }}
    />
  )
}
