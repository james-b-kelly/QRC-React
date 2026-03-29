import QRCodeLib from 'qrcode'
import type { ErrorCorrectionLevel, FinderPattern, QRMatrix } from './types'

export function generateMatrix(
  data: string,
  errorCorrectionLevel: ErrorCorrectionLevel = 'M',
): QRMatrix {
  const qr = QRCodeLib.create(data, {
    errorCorrectionLevel,
  })

  const { modules } = qr
  const size = modules.size
  const moduleData = modules.data

  // Parse into boolean[][] matrix
  const matrix: boolean[][] = []
  for (let row = 0; row < size; row++) {
    const rowArr: boolean[] = []
    for (let col = 0; col < size; col++) {
      rowArr.push(moduleData[row * size + col] === 1)
    }
    matrix.push(rowArr)
  }

  // Finder patterns are always at fixed positions in QR codes
  const finderPatterns: FinderPattern[] = [
    { row: 0, col: 0 }, // top-left
    { row: 0, col: size - 7 }, // top-right
    { row: size - 7, col: 0 }, // bottom-left
  ]

  return { modules: matrix, size, finderPatterns }
}

export function isInFinderPattern(
  row: number,
  col: number,
  size: number,
): boolean {
  // Top-left 7x7
  if (row < 7 && col < 7) return true
  // Top-right 7x7
  if (row < 7 && col >= size - 7) return true
  // Bottom-left 7x7
  if (row >= size - 7 && col < 7) return true
  return false
}
