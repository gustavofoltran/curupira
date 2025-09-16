import { TextField } from '@mui/material'
import { GridRowModel } from '@mui/x-data-grid'

export const renderEditCellTextField = (params: GridRowModel) => (
  <TextField
    value={params.value}
    sx={{
      height: '90%',
      outline: 'none',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: '0.5rem',
      padding: 0,
      mx: 1,
      borderColor: 'tertiary.light',
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
      const value = e.target.value
      params.api.setEditCellValue({
        id: params.id,
        field: params.field,
        value,
      })
    }}
  />
)
