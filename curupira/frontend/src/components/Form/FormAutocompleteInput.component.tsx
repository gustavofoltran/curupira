import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { get as _get } from 'lodash'
import { ReactNode, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useDebounce } from '~/hooks'
import { TSelectOption } from '~/types'
import { useFormComponents } from './context/FormComponents.context'

type Props = Omit<TextFieldProps, 'id'> & {
  id: string
  autocompleteProps?: Omit<
    AutocompleteProps<TSelectOption, true, true, true>,
    'options' | 'renderInput'
  >
  options: TSelectOption[]
  onDebounce?: (value: string) => void
}

export const FormAutocompleteInput = ({
  id,
  options,
  autocompleteProps,
  onDebounce,
  disabled,
  ...rest
}: Props) => {
  useFormComponents()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  const [textFieldValue, setTextFieldValue] = useState('')
  const debouncedTextFieldValue = useDebounce(textFieldValue, 500)

  useEffect(() => {
    if (onDebounce) {
      onDebounce(debouncedTextFieldValue)
    }
  }, [debouncedTextFieldValue])

  // Extração das mensagens de erro
  const errorMessageValue = _get(errors, `${id}.value.message`) as ReactNode
  const errorMessageLabel = _get(errors, `${id}.label.message`) as ReactNode

  const errorMessage = errorMessageValue || errorMessageLabel

  return (
    <Controller
      name={id}
      control={control}
      render={({ field: { onChange, ...fieldRest } }) => (
        <Autocomplete
          size="small"
          options={options}
          onChange={(_event, value) => {
            onChange(value)
          }}
          disabled={disabled}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              {...rest}
              error={!!errorMessage}
              helperText={errorMessage}
              style={{
                height: errorMessage ? '78px' : '64px',
              }}
              onChange={(event) => {
                const value = event.target.value
                setTextFieldValue(value)
              }}
            />
          )}
          {...autocompleteProps}
          {...fieldRest}
        />
      )}
    />
  )
}
