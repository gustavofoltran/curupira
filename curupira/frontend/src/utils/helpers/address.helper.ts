import { cepRegexMask } from '../regexMasks'

type Address = {
  city: string
  complement: string
  number: string
  state: string
  street: string
  zipCode: string
}

export const addressToGoogleMap = (address: Address | undefined): string => {
  if (!address) return ''
  return `${address.number},${address.street},${address.city},${address.state}${address.zipCode}`
}

export const adressToString = (address: Address | undefined): string => {
  if (!address) return ''
  return `${address.street}, ${address.number}, ${address.city} - ${
    address.state
  }, ${cepRegexMask(address.zipCode)}`
}
