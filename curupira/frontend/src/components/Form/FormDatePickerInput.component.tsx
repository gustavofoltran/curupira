import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TextField, TextFieldProps } from '@mui/material'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import updateLocale from 'dayjs/plugin/updateLocale'
import { get as _get } from 'lodash'

import { formatDateYYYYMMDD } from '~/utils/helpers'

import { useFormComponents } from './context/FormComponents.context'

type TProps = {
  id: string
  label: string
  defaultValue?: Date | null
  disabled?: boolean
  datePickerProps?: any
  textFieldProps?: TextFieldProps
}

export const FormDatePickerInput = ({
  id,
  label,
  defaultValue = null,
  datePickerProps,
  textFieldProps,
  disabled = false,
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
    return formatDateYYYYMMDD(new Date(value), '-')
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ptBr}>
      <Controller
        name={id}
        control={control}
        defaultValue={defaultValue}
        render={({
          field: { onChange: fieldOnChange, value, onBlur, ...fieldRest },
        }) => (
          <DesktopDatePicker
            label={label}
            inputFormat="DD/MM/YYYY"
            onAccept={onBlur}
            onChange={(newValue) => {
              fieldOnChange(handleChange(newValue))
            }}
            value={value}
            disabled={disabled}
            error={!!_get(errors, `${id}.message`)}
            renderInput={(params) => (
              <TextField
                data-cy={`${id}-input`}
                size="small"
                style={{
                  height: _get(errors, `${id}.message`) ? '78px' : '64px',
                }}
                FormHelperTextProps={
                  {
                    'data-cy': `${id}-helper-text`,
                    id: `${id}-helper-text`,
                  } as any
                }
                helperText={_get(errors, `${id}.message`) as ReactNode}
                {...params}
                inputProps={{
                  ...params.inputProps,
                  placeholder: 'dd/mm/aaaa',
                }}
                type="text"
                error={!!_get(errors, `${id}.message`)}
                {...fieldRest}
                {...textFieldProps}
              />
            )}
            {...fieldRest}
            {...datePickerProps}
          />
        )}
      />
    </LocalizationProvider>
  )
}
