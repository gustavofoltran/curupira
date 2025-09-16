export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export const toFileBase64 = async (file: File): Promise<string> =>
  ((await toBase64(file)) as string).replace('data:application/pdf;base64,', '')
