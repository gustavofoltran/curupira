import { GridRowModel } from '@mui/x-data-grid'

export const nestedData = (params: GridRowModel) => {
  return params.field
    .split('.')
    .reduce(
      (obj: { [x: string]: any }, field: string | number) => obj && obj[field],
      params,
    )
}
