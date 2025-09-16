import {
  Box,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from '@mui/material'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'
import { get as _get } from 'lodash'

type Props = {
  id: string
  values: {
    label: string
    value: string
  }[]
  row?: boolean
}

export const FormRadioGroup = ({ id, values, row = true }: Props) => {
  useFormComponents()

  const { palette } = useTheme()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  return (
    <Box>
      <Controller
        name={id}
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <RadioGroup {...field} row={row}>
            {values.map((item) => (
              <FormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio />}
                label={
                  <Typography color={palette.text.primary}>
                    {item.label}
                  </Typography>
                }
              />
            ))}
          </RadioGroup>
        )}
      />
      <FormHelperText error style={{ marginTop: '2px', marginBottom: '12px' }}>
        {_get(errors, `${id}.message`) as ReactNode}
      </FormHelperText>
    </Box>
  )
}
