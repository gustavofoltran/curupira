import { InputAdornment, TextField, TextFieldProps } from '@mui/material'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'
import { get as _get } from 'lodash'
import { formatPercentageToDisplay } from '~/utils/helpers'

type Props = Omit<TextFieldProps, 'id'> & {
  id: string
  min?: number
  max?: number
}

export const FormPercentageInput = ({
  id,
  InputProps,
  min = 0,
  max = 100,
  ...rest
}: Props) => {
  useFormComponents()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  return (
    <Controller
      name={id}
      control={control}
      defaultValue={''}
      render={({ field: { onChange: fieldOnChange, ...fieldRest } }) => (
        <TextField
          id={id}
          size="small"
          style={{
            height: _get(errors, `${id}.message`) ? '78px' : '64px',
          }}
          helperText={_get(errors, `${id}.message`) as ReactNode}
          error={!!_get(errors, `${id}.message`)}
          onChange={(e) =>
            fieldOnChange(formatPercentageToDisplay(e.target.value, min, max))
          }
          InputProps={{
            startAdornment: <InputAdornment position="start">%</InputAdornment>,
            ...InputProps,
          }}
          {...rest}
          {...fieldRest}
        />
      )}
    />
  )
}
