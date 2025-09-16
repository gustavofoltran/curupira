import { FormControl, TextField } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import { get as _get } from 'lodash'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'

type TProps = {
  id: string
  label: string
  defaultValue?: Date | null
  disabled?: boolean
  datePickerProps?: any
}

export const FormDateTimePickerInput = ({
  id,
  label,
  defaultValue = null,
  datePickerProps,
  disabled,
}: TProps) => {
  useFormComponents()

  dayjs.extend(updateLocale)
  dayjs.updateLocale('pt-br', {
    weekdaysMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  })

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  const handleChange = (value: any) => {
    if (!value) return ''
    return new Date(value)
  }

  return (
    <FormControl sx={{ width: 1 }}>
      <Controller
        name={id}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label={label}
              inputFormat="DD/MM/YYYY HH:mm"
              onChange={(newValue) => {
                field.onChange(handleChange(newValue))
              }}
              value={field.value}
              disabled={!!disabled}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  size="small"
                  style={{
                    height: _get(errors, `${id}.message`) ? '78px' : '64px',
                  }}
                  helperText={_get(errors, `${id}.message`) as ReactNode}
                  error={!!_get(errors, `${id}.message`)}
                  inputProps={{
                    ...params.inputProps,
                    placeholder: 'dd/mm/aaaa hh:mm',
                  }}
                />
              )}
              {...datePickerProps}
            />
          </LocalizationProvider>
        )}
      />
    </FormControl>
  )
}
