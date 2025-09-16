import {
  Autocomplete,
  AutocompleteProps,
  FormControl,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TSelectOption } from '~/types'
import { useFormComponents } from './context/FormComponents.context'
import { get as _get } from 'lodash'

type Props = Omit<TextFieldProps, 'id' | 'disabled' | 'onChange'> & {
  id: string
  values: TSelectOption[]
  defaultValue?: string | any
  disabled?: boolean
  onSelectNewItem?: (newItem: TSelectOption) => void
  onRemoveItem?: (removedItem: TSelectOption) => void
  autocompleteProps?: Omit<
    AutocompleteProps<any, true, true, true>,
    'options' | 'renderInput'
  >
}

export const FormAutocompleteMultipleInput = (props: Props) => {
  useFormComponents()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  const {
    id,
    values,
    autocompleteProps,
    disabled,
    defaultValue = [],
    onSelectNewItem,
    onRemoveItem,
    ...rest
  } = props

  return (
    <FormControl fullWidth size="small">
      <Controller
        name={id}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Autocomplete
            size="small"
            multiple={true}
            disableCloseOnSelect={true}
            disabled={disabled}
            options={values.filter(
              (value) =>
                !field.value.find(
                  (selectedValue: any) => selectedValue.value === value.value,
                ),
            )}
            {...field}
            onChange={(_event, value, reason) => {
              if (reason === 'selectOption' || reason === 'clear') {
                if (onSelectNewItem) {
                  const newItem = value.find(
                    (selectedValue: any) =>
                      !field.value.find(
                        (existingValue: any) =>
                          existingValue.value === selectedValue.value,
                      ),
                  )
                  if (newItem) {
                    onSelectNewItem(newItem)
                  }
                }
              }
              if (reason === 'removeOption') {
                if (onRemoveItem) {
                  const removedItem = field.value.find(
                    (selectedValue: any) =>
                      !value.find(
                        (existingValue: any) =>
                          existingValue.value === selectedValue.value,
                      ),
                  )
                  if (removedItem) {
                    onRemoveItem(removedItem)
                  }
                }
              }
              field.onChange(value)
            }}
            renderInput={(params) => (
              <TextField
                style={{
                  height: _get(errors, `${id}.message`) ? '78px' : '100',
                }}
                helperText={_get(errors, `${id}.message`) as ReactNode}
                error={!!_get(errors, `${id}.message`)}
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
