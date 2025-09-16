export function downloadBase64File(
  contentType: string,
  base64Data: string,
  fileName: string,
) {
  const linkSource = `data:${contentType};base64,${base64Data}`
  const downloadLink = document.createElement('a')
  downloadLink.href = linkSource
  downloadLink.download = fileName
  downloadLink.click()
}
