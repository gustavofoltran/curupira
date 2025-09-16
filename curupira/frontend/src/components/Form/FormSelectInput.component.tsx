import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material'
import { get as _get } from 'lodash'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TSelectOption } from '~/types'
import { useFormComponents } from './context/FormComponents.context'

type Props = Omit<
  SelectProps,
  'id' | 'label' | 'values' | 'defaultValues' | 'disabled'
> & {
  id: string
  label: string
  values: TSelectOption[]
  disabled?: boolean
  defaultValue?: any
  formControlProps?: FormControlProps
}

export const FormSelectInput = ({
  id,
  values,
  label,
  disabled = false,
  formControlProps,
  defaultValue,
  ...rest
}: Props) => {
  useFormComponents()

  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<any>()

  const labelId = `${id}-label`

  return (
    <FormControl
      fullWidth
      size="small"
      style={{
        height: _get(errors, `${id}.message`) ? '78px' : '64px',
      }}
      {...formControlProps}
    >
      <InputLabel id={labelId} shrink={watch(id)}>
        {label}
      </InputLabel>
      <Controller
        name={id}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select
            label={label}
            labelId={labelId}
            error={!!_get(errors, `${id}.message`)}
            disabled={disabled}
            notched={watch(id)}
            {...field}
            {...rest}
          >
            {values.map((value) => (
              <MenuItem
                key={value.value}
                value={value.value}
                disabled={value.disabled}
              >
                {value.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      <FormHelperText error id={`${id}-helper-text`}>
        {_get(errors, `${id}.message`) as ReactNode}
      </FormHelperText>
    </FormControl>
  )
}
