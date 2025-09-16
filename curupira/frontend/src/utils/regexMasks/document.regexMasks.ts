import { cnpjRegexMask } from './cnpj.regexMasks'
import { cpfRegexMask } from './cpf.regexMasks'

export const documentRegexMask = (value?: string) => {
  if (!value) return value

  if (value.length === 11) return cpfRegexMask(value)
  return cnpjRegexMask(value)
}
