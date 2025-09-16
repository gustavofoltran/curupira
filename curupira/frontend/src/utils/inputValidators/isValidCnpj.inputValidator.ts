import { isValid } from '@fnando/cnpj/'

export const isValidCnpj = (value: string) => {
  return isValid(value)
}
