import {
  ToggleButtonGroup,
  ToggleButtonGroupProps,
  ToggleButton as ToggleButtonMUI,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'

type TProps = {
  value: string
  onChange: (value: string) => void
  values: {
    value: string
    label: string
  }[]
  toggleButtonGroupProps?: Omit<ToggleButtonGroupProps, 'value' | 'onChange'>
}

export const ToggleButton = ({
  value,
  onChange,
  values,
  toggleButtonGroupProps,
}: TProps) => {
  const theme = useTheme()

  return (
    <ToggleButtonGroup
      color="primary"
      exclusive
      value={value}
      onChange={(_, newValue) => {
        if (newValue === null) return
        onChange(newValue)
      }}
      {...toggleButtonGroupProps}
    >
      {values.map((item, index) => (
        <ToggleButtonMUI
          key={index}
          value={item.value}
          sx={{
            textTransform: 'capitalize',
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
            backgroundColor:
              value === item.value
                ? `${alpha(theme.palette.primary.light, 0.2)} !important`
                : undefined,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.light, 0.2),
            },
          }}
        >
          <Typography variant="body2" fontWeight={700} px={2}>
            {item.label}
          </Typography>
        </ToggleButtonMUI>
      ))}
    </ToggleButtonGroup>
  )
}
