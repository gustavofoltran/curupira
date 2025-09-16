import { InputAdornment, TextField, TextFieldProps } from '@mui/material'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'
import { get as _get } from 'lodash'
import { formatCurrencyToDisplay } from '~/utils/helpers'

type Props = Omit<TextFieldProps, 'id'> & {
  id: string
}

export const FormCurrencyInput = ({ id, InputProps, ...rest }: Props) => {
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
          data-cy={`${id}-input`}
          size="small"
          style={{
            height: _get(errors, `${id}.message`) ? '78px' : '64px',
          }}
          helperText={_get(errors, `${id}.message`) as ReactNode}
          error={!!_get(errors, `${id}.message`)}
          onChange={(e) =>
            fieldOnChange(formatCurrencyToDisplay(e.target.value))
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">R$</InputAdornment>
            ),
            ...InputProps,
          }}
          {...rest}
          {...fieldRest}
        />
      )}
    />
  )
}
