import { InputAdornment, InputProps, TextField } from '@mui/material'
import { GridRowModel } from '@mui/x-data-grid'

import { formatPercentageToDisplay } from '~/utils/helpers'

export const renderEditCellPercentage = (
  params: GridRowModel,
  InputProps?: InputProps,
) => (
  <TextField
    value={params.value}
    sx={{
      height: '90%',
      outline: 'none',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: '0.5rem',
      padding: 0,
      borderColor: 'tertiary.light',
      mx: 1,
      '& .MuiOutlinedInput-input': {
        py: 0,
      },
      '& .MuiOutlinedInput-root': {
        my: 'auto',
      },
      ':focus-within': {
        borderColor: 'primary.main',
      },
    }}
    size="small"
    error={params.error}
    onChange={(e) => {
      const value = formatPercentageToDisplay(e.target.value, 0, 100)

      params.api.setEditCellValue({
        id: params.id,
        field: params.field,
        value,
      })
    }}
    InputProps={{
      startAdornment: <InputAdornment position="start">%</InputAdornment>,
      ...InputProps,
    }}
  />
)
