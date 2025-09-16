export const paycardRegexMask = (value?: string) => {
  if (!value) return value

  let cardNumber = value
  value = value.replace(/\D/g, '')
  if (/^3[47]\d{0,13}$/.test(value)) {
    cardNumber = value
      .replace(/(\d{4})/, '$1 ')
      .replace(/(\d{4}) (\d{6})/, '$1 $2 ')
  } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
    // diner's club, 14 digits
    cardNumber = value
      .replace(/(\d{4})/, '$1 ')
      .replace(/(\d{4}) (\d{6})/, '$1 $2 ')
  } else if (/^\d{0,16}$/.test(value)) {
    // regular cc number, 16 digits
    cardNumber = value
      .replace(/(\d{4})/, '$1 ')
      .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
      .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
  }
  return cardNumber.trimRight()
}
