import { FormControl, TextField, TextFieldProps } from '@mui/material'
import InputMask from 'react-input-mask'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'
import { get as _get } from 'lodash'
import { cellPhoneInputMask, landlinePhoneInputMask } from '~/utils/inputMasks'
import { onlyNumbers } from '~/utils/helpers'

type Props = Omit<TextFieldProps, 'id' | 'disabled'> & {
  id: string
  defaultValue?: string
  disabled?: boolean
}

export const FormDynamicMaskedPhoneInput = ({
  id,
  defaultValue = '',
  disabled = false,
  ...rest
}: Props) => {
  useFormComponents()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  return (
    <FormControl sx={{ width: 1 }}>
      <Controller
        name={id}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => {
          const mask =
            onlyNumbers(value).length >= 3 && onlyNumbers(value)[2] === '9'
              ? cellPhoneInputMask
              : landlinePhoneInputMask

          return (
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
                style={{
                  height: _get(errors, `${id}.message`) ? '78px' : '64px',
                }}
                helperText={_get(errors, `${id}.message`) as ReactNode}
                error={!!_get(errors, `${id}.message`)}
                disabled={disabled}
                {...rest}
              />
            </InputMask>
          )
        }}
      />
    </FormControl>
  )
}
