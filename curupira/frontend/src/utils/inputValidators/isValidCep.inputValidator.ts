import { onlyNumbers } from '../helpers'

export const isValidCep = (value = '') => {
  return onlyNumbers(value).length === 8 ? true : false
}
