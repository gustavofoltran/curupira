import { GridRowModel } from '@mui/x-data-grid'

import {
  base64toBlob,
  formatCurrencyToDisplay,
  formatPercentageToDisplay,
} from '~/utils/helpers'

export const valueGetter = (params: GridRowModel) => {
  return params
}

export const valueGetterCurrency = (params: GridRowModel) => {
  const value = valueGetter(params)
  try {
    return formatCurrencyToDisplay(value.toFixed(2))
  } catch {
    return value
  }
}

export const valueGetterPercentage = (params: GridRowModel) => {
  const value = valueGetter(params)
  try {
    return formatPercentageToDisplay(value.toFixed(2), 0, 100)
  } catch {
    return value
  }
}

export const valueGetterDate = (params: GridRowModel) => {
  const value = valueGetter(params)
  try {
    const partesData = value.split('-')
    return value
  } catch {
    const date = new Date(value)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
}

export const valueGetterFile = (params: GridRowModel) => {
  const value = valueGetter(params)
  try {
    const file = new File([base64toBlob(value)], 'comprovante.pdf', {
      type: 'application/pdf',
    })
    return file.name
  } catch {
    return value.name
  }
}
