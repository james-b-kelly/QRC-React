export function svgToPNG(svgString: string, size: number = 1024): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()

    img.onload = () => {
      // Parse viewBox to get aspect ratio (handles frames that change dimensions)
      const viewBoxMatch = svgString.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
      const svgW = viewBoxMatch ? parseFloat(viewBoxMatch[1]) : 1
      const svgH = viewBoxMatch ? parseFloat(viewBoxMatch[2]) : 1
      const aspect = svgH / svgW
      const canvasW = size
      const canvasH = Math.round(size * aspect)

      const canvas = document.createElement('canvas')
      canvas.width = canvasW
      canvas.height = canvasH
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, canvasW, canvasH)
      URL.revokeObjectURL(url)

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert canvas to blob'))
        }
      }, 'image/png')
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG image'))
    }

    img.src = url
  })
}
