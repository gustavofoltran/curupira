import { TextField, TextFieldProps } from '@mui/material'
import { get as _get } from 'lodash'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { useFormComponents } from './context/FormComponents.context'

type Props = Omit<TextFieldProps, 'id' | 'disabled'> & {
  id: string
  mask: string
  disabled?: boolean
}

export const FormMaskedTextInput = ({ id, mask, disabled, ...rest }: Props) => {
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
      render={({ field: { onChange, value } }) => (
        <InputMask
          mask={mask}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <TextField
            id={id}
            data-cy={`${id}-input`}
            size="small"
            autoComplete="off"
            style={{
              height: _get(errors, `${id}.message`) ? '78px' : '64px',
            }}
            helperText={_get(errors, `${id}.message`) as ReactNode}
            error={!!_get(errors, `${id}.message`)}
            {...rest}
          />
        </InputMask>
      )}
    />
  )
}
