export const cepRegexMask = (value?: string) => {
  if (!value) return value
  return value.replace(/(\d{5})(\d)/, '$1-$2')
}
