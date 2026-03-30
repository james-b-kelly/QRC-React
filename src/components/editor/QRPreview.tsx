interface QRPreviewProps {
  svg: string
}

export default function QRPreview({ svg }: QRPreviewProps) {
  return (
    <div
      role="img"
      aria-label="QR code preview"
      className="w-full aspect-square rounded-2xl bg-white shadow-lg ring-1 ring-black/5 [&>svg]:w-full [&>svg]:h-full [&>svg]:rounded-2xl"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
