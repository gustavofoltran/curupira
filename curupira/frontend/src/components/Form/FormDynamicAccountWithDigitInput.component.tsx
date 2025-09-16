import { FormControl, TextField, TextFieldProps } from '@mui/material'
import InputMask, { BeforeMaskedStateChangeStates } from 'react-input-mask'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'
import { get as _get } from 'lodash'
import { onlyNumbers } from '~/utils/helpers'

type Props = Omit<TextFieldProps, 'id' | 'disabled'> & {
  id: string
  defaultValue?: string
  disabled?: boolean
}

export const FormDynamicAccountWithDigitInput = ({
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

  function beforeMaskedStateChange({
    nextState,
    currentState,
  }: BeforeMaskedStateChangeStates) {
    const currentStateValue = onlyNumbers(currentState?.value)

    if (currentStateValue.length > 2 && currentStateValue.length <= 21) {
      return {
        ...currentState,
      }
    }

    return nextState
  }

  function formatMask(value: string) {
    const defaultMask = '99-9'
    if (!value || value.length <= 1) {
      return defaultMask
    }

    const customMask = `${'9'.repeat(value.length - 1)}-9`
    return customMask
  }

  return (
    <FormControl sx={{ width: 1 }}>
      <Controller
        name={id}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <InputMask
            mask={formatMask(onlyNumbers(value))}
            value={value}
            onChange={onChange}
            beforeMaskedStateChange={beforeMaskedStateChange}
            disabled={disabled}
          >
            <TextField
              id={id}
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
        )}
      ></Controller>
    </FormControl>
  )
}
