import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
  useTheme,
} from '@mui/material'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'
import { get as _get } from 'lodash'

type Props = {
  id: string
  label: string
}

export const FormCheckbox = ({ id, label }: Props) => {
  const { palette } = useTheme()
  useFormComponents()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  return (
    <Box display={'block'}>
      <Controller
        name={id}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            checked={field.value}
            control={<Checkbox id={id} />}
            label={
              <Typography color={palette.text.primary}>{label}</Typography>
            }
            {...field}
          />
        )}
      />
      <FormHelperText error style={{ marginTop: '2px', marginBottom: '12px' }}>
        {_get(errors, `${id}.message`) as ReactNode}
      </FormHelperText>
    </Box>
  )
}
