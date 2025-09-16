import { InputProps, TextField } from '@mui/material'
import { GridRowModel } from '@mui/x-data-grid'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ptBR from 'dayjs/locale/pt-br'

import { formatDateYYYYMMDD } from '~/utils/helpers'

export const renderEditCellDate = (
  params: GridRowModel,
  InputProps?: InputProps,
) => {
  const formatValue = (value: any) => {
    if (!value) return ''
    return formatDateYYYYMMDD(new Date(value), '-')
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ptBR}>
      <DesktopDatePicker
        inputFormat="DD/MM/YYYY"
        renderInput={(params) => (
          <TextField
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
            InputProps={InputProps}
            {...params}
          />
        )}
        onChange={(newValue) => {
          const value = formatValue(newValue)
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value,
          })
        }}
        value={params.value}
      />
    </LocalizationProvider>
  )
}
