export const downloadFileBlob = async (blob: Blob, fileName: string) => {
  // Criar um link temporário para o download
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url

  // Nome do arquivo de download
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
