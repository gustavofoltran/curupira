import { Buffer } from 'buffer'

type TContentType = Record<string, string>

export const contentTypeMap: TContentType = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
}

export const base64toBlob = (
  base64Data: string,
  contentType = 'application/pdf',
): Blob => {
  contentType = contentType || ''
  const sliceSize = 1024
  const byteCharacters = Buffer.from(base64Data, 'base64').toString('latin1')
  const bytesLength = byteCharacters.length
  const slicesCount = Math.ceil(bytesLength / sliceSize)
  const byteArrays = new Array(slicesCount)

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize
    const end = Math.min(begin + sliceSize, bytesLength)

    const bytes = new Array(end - begin)
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0)
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes)
  }
  return new Blob(byteArrays, { type: contentType })
}
