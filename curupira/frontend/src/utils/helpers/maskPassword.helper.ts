export const maskPassword = (password: string) => {
  if (password.length <= 2) {
    return password
  }
  const visibleChars = 2 // Número de caracteres visíveis no início e no final
  const maskedLength = password.length - visibleChars * 2
  const maskedPart = '*'.repeat(maskedLength)
  return (
    password.slice(0, visibleChars) + maskedPart + password.slice(-visibleChars)
  )
}
