import { isValid } from '@fnando/cpf/'

export const isValidCpf = (value: string) => {
  return isValid(value)
}
