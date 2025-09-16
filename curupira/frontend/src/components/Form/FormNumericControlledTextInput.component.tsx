import { TextField, TextFieldProps } from '@mui/material'
import { ChangeEvent, ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'
import { get as _get } from 'lodash'

type Props = Omit<TextFieldProps, 'id'> & {
  id: string
  min?: number
  max?: number
}

type OnChangeFn = {
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  controllerOnChangeFn: (...event: any[]) => void
  value: string
}

export const FormNumericControlledTextInput = ({
  id,
  min,
  max,
  ...rest
}: Props) => {
  useFormComponents()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  const onChangeFn = ({ event, controllerOnChangeFn, value }: OnChangeFn) => {
    const onlyNumbers = event.target.value.replace(/[^0-9]+/g, '')

    controllerOnChangeFn(onlyNumbers)

    if (min && +onlyNumbers < min) {
      controllerOnChangeFn(value)
    }

    if (max && +onlyNumbers > max) {
      controllerOnChangeFn(value)
    }

    if (onlyNumbers === '') {
      controllerOnChangeFn(onlyNumbers)
    }
  }

  return (
    <Controller
      name={id}
      control={control}
      defaultValue=""
      render={({ field: { onChange, value, ...fieldRest } }) => (
        <TextField
          id={id}
          size="small"
          style={{
            height: _get(errors, `${id}.message`) ? '78px' : '64px',
          }}
          helperText={_get(errors, `${id}.message`) as ReactNode}
          error={!!_get(errors, `${id}.message`)}
          {...rest}
          {...fieldRest}
          value={value}
          onChange={(e) => {
            onChangeFn({
              event: e,
              controllerOnChangeFn: onChange,
              value,
            })
          }}
        />
      )}
    />
  )
}
