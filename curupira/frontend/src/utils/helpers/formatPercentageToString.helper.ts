const changeDecimalSeparator = (value: string) => value.replace(',', '.')

export const formatPercentageToString = (value: string) => {
  const digitsWithSeparator = changeDecimalSeparator(value)
  return digitsWithSeparator
}
