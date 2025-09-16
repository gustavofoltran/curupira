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

const addDecimalToNumber = (
  number: string,
  separator: string,
  min: number,
  max: number,
) => {
  const decimalStartingPosition = number.length - 2
  const integer = removeLeadingZeros(
    number.substring(0, decimalStartingPosition),
  )
  const realInteger = +integer > max ? max : +integer < min ? min : +integer
  const decimal = number.substring(decimalStartingPosition)
  const realDecimal = realInteger === max ? '00' : decimal
  return realInteger + separator + realDecimal
}

export const formatPercentageToDisplay = (
  value: string,
  min: number,
  max: number,
) => {
  const digits = getDigitsFromValue(value)
  const digitsWithPadding = padDigits(digits)
  return addDecimalToNumber(digitsWithPadding, ',', min, max)
}
