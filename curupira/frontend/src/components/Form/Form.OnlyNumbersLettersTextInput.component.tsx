import { TextField, TextFieldProps } from '@mui/material'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'
import { get as _get } from 'lodash'

type Props = Omit<TextFieldProps, 'id'> & {
  id: string
}

export const FormOnlyNumbersLettersTextInput = ({ id, ...rest }: Props) => {
  useFormComponents()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  return (
    <Controller
      name={id}
      control={control}
      defaultValue=""
      render={({ field: { onChange, ...fieldRest } }) => (
        <TextField
          id={id}
          size="small"
          style={{
            height: _get(errors, `${id}.message`) ? '78px' : '64px',
          }}
          helperText={_get(errors, `${id}.message`) as ReactNode}
          error={!!_get(errors, `${id}.message`)}
          onChange={(e) => {
            onChange(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))
          }}
          {...rest}
          {...fieldRest}
        />
      )}
    />
  )
}
