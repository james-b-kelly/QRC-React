interface QRPreviewProps {
  svg: string
}

export default function QRPreview({ svg }: QRPreviewProps) {
  return (
    <div className="flex items-center justify-center p-6">
      <div
        role="img"
        aria-label="QR code preview"
        className="w-full max-w-[400px] aspect-square rounded-xl bg-white shadow-lg p-4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  )
}
