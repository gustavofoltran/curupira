const getDigitsFromValue = (value = '') =>
  value.replace(/(-(?!\d))|[^0-9|-]/g, '') || ''
const padDigits = (digits: string) => {
  const desiredLength = 3
  const actualLength = digits.length

  if (actualLength >= desiredLength) {
    return digits
  }

  const amountToAdd = desiredLength - actualLength
  const padding = '0'.repeat(amountToAdd)

  return padding + digits
}

const removeLeadingZeros = (number: string) =>
  number.replace(/^0+([0-9]+)/, '$1')

const addDecimalToNumber = (number: string, separator: string) => {
  const centsStartingPosition = number.length - 2
  const reals = removeLeadingZeros(number.substring(0, centsStartingPosition))
  const localeReals = reals.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const cents = number.substring(centsStartingPosition)
  return localeReals + separator + cents
}

export const formatCurrencyToDisplay = (value: string) => {
  const digits = getDigitsFromValue(value)
  const digitsWithPadding = padDigits(digits)
  return addDecimalToNumber(digitsWithPadding, ',')
}
