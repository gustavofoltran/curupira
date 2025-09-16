import { FormControl, TextField, TextFieldProps } from '@mui/material'
import InputMask, { BeforeMaskedStateChangeStates } from 'react-input-mask'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'
import { get as _get } from 'lodash'
import { cnpjInputMask, cpfInputMask } from '~/utils/inputMasks'
import { onlyNumbers } from '~/utils/helpers'

type Props = Omit<TextFieldProps, 'id' | 'disabled'> & {
  id: string
  defaultValue?: string
  disabled?: boolean
}

export const FormDynamicMaskedCpfCnpjInput = ({
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
    previousState,
  }: BeforeMaskedStateChangeStates) {
    const currentStateValue = onlyNumbers(currentState?.value)

    if (previousState?.selection?.start === 16) {
      return nextState
    }

    if (nextState?.selection?.start === 15) {
      return {
        ...nextState,
        selection: {
          start: 16,
          end: 16,
        },
      }
    }

    if (currentStateValue.length > 11 && currentStateValue.length <= 14) {
      return {
        ...currentState,
      }
    }

    return nextState
  }

  return (
    <FormControl sx={{ width: 1 }}>
      <Controller
        name={id}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <InputMask
            mask={onlyNumbers(value).length > 11 ? cnpjInputMask : cpfInputMask}
            value={value}
            onChange={onChange}
            beforeMaskedStateChange={beforeMaskedStateChange}
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
        )}
      ></Controller>
    </FormControl>
  )
}
