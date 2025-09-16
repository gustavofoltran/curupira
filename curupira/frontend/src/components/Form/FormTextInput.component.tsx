import { InfoTwoTone } from '@mui/icons-material'
import { TextField, TextFieldProps, Tooltip } from '@mui/material'
import { get as _get } from 'lodash'
import { ReactNode, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDebounce } from '~/hooks'
import { useFormComponents } from './context/FormComponents.context'

type Props = Omit<TextFieldProps, 'id'> & {
  id: string
  onDebounce?: (value: string) => void
  infoMessage?: string
}

export const FormTextInput = ({
  id,
  onDebounce,
  infoMessage,
  ...rest
}: Props) => {
  useFormComponents()

  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext()

  const watchedValue = watch(id)
  const debouncedTextFieldValue = useDebounce(watchedValue, 500)

  useEffect(() => {
    if (onDebounce) {
      onDebounce(debouncedTextFieldValue)
    }
  }, [debouncedTextFieldValue])

  return (
    <>
      <TextField
        id={id}
        data-cy={`${id}-input`}
        size="small"
        style={{ height: _get(errors, `${id}.message`) ? '78px' : '64px' }}
        helperText={_get(errors, `${id}.message`) as ReactNode}
        InputProps={{
          endAdornment: infoMessage && (
            <Tooltip title={infoMessage} placement="left">
              <InfoTwoTone fontSize="small" color="primary" />
            </Tooltip>
          ),
        }}
        InputLabelProps={{
          shrink: watchedValue ? true : false,
        }}
        error={!!_get(errors, `${id}.message`)}
        {...register(id)}
        {...rest}
      />
    </>
  )
}
