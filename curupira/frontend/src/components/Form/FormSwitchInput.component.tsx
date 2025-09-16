import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  Switch,
  SwitchProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material'
import { get as _get } from 'lodash'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'

type Props = {
  id: string
  label: string
  switchProps?: SwitchProps
}

export const FormSwitchInput = ({ id, label, switchProps }: Props) => {
  useFormComponents()
  const theme = useTheme()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  return (
    <Box>
      <Box
        display="flex"
        gap={2}
        alignItems="center"
        justifyContent={'start'}
        width={1}
        style={{ height: '44px' }}
      >
        <Box>
          <FormControl>
            <Controller
              name={id}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Switch
                  focusVisibleClassName=".Mui-focusVisible"
                  disableRipple
                  checked={field.value}
                  sx={switchInputStyle(theme)}
                  {...switchProps}
                  {...field}
                />
              )}
            />
          </FormControl>
        </Box>
        <InputLabel error={!!_get(errors, `${id}.message`)} sx={{ width: 1 }}>
          <Typography sx={{ color: 'secondary.main' }}>{label}</Typography>
        </InputLabel>
      </Box>
      <FormHelperText
        error
        data-cy={`${id}-helper-text`}
        style={{ marginTop: '0' }}
      >
        {_get(errors, `${id}.message`) as ReactNode}
      </FormHelperText>
    </Box>
  )
}

export const switchInputStyle = (theme: Theme) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: '4px',
    transitionDuration: '300ms',
    color: theme.palette.primary.main,
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: theme.palette.primary.main,
      border: `2px solid ${theme.palette.primary.main}`,
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 18,
    height: 18,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#fff',
    border: `2px solid ${theme.palette.primary.main}`,
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
})
