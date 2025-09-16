import {
  Autocomplete,
  AutocompleteProps,
  FormControl,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TSelectOption } from '~/types'
import { useFormComponents } from './context/FormComponents.context'
import { get as _get } from 'lodash'
import { useDebounce } from '~/hooks'

type Props = Omit<TextFieldProps, 'id' | 'disabled' | 'onChange'> & {
  id: string
  values: TSelectOption[]
  defaultValue?: string | any
  disabled?: boolean
  onDebounce?: (value: string) => void
  autocompleteProps?: Omit<
    AutocompleteProps<any, true, true, true>,
    'options' | 'renderInput'
  >
}

export const FormMultipleAutocompleteInput = ({
  id,
  values,
  onDebounce,
  disabled,
  defaultValue = [],
  autocompleteProps,
  ...rest
}: Props) => {
  useFormComponents()

  const [textFieldValue, setTextFieldValue] = useState('')

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  const debouncedTextFieldValue = useDebounce(textFieldValue, 500)

  useEffect(() => {
    if (onDebounce) {
      onDebounce(debouncedTextFieldValue)
    }
  }, [debouncedTextFieldValue])

  return (
    <FormControl fullWidth>
      <Controller
        name={id}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Autocomplete
            id={id}
            size="small"
            multiple
            disableCloseOnSelect={true}
            disabled={disabled}
            options={values.filter(
              (value) =>
                !field.value.find(
                  (selectedValue: any) => selectedValue.value === value.value,
                ),
            )}
            {...field}
            onChange={(_event, value) => {
              field.onChange(value)
            }}
            renderInput={(params) => (
              <TextField
                style={{
                  height: _get(errors, `${id}.message`) ? '78px' : '100%',
                }}
                helperText={_get(errors, `${id}.message`) as ReactNode}
                error={!!_get(errors, `${id}.message`)}
                onChange={(event) => {
                  const value = event.target.value
                  setTextFieldValue(value)
                }}
                {...params}
                {...rest}
              />
            )}
            {...autocompleteProps}
          />
        )}
      />
    </FormControl>
  )
}
