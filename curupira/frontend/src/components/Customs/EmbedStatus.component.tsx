import {
  alpha,
  Box,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'

const st = (
  theme: Theme,
): Record<
  string,
  { label: string; color: string; backgroundColor: string }
> => ({
  ACTIVE: {
    label: 'Ativo',
    color: 'success.contrastText',
    backgroundColor: theme.palette.success.main,
  },
  INACTIVE: {
    label: 'Inativo',
    color: 'error.contrastText',
    backgroundColor: theme.palette.error.main,
  },
  AVAILABLE_FOR_USE: {
    label: 'Disponível para uso',
    color: 'success.contrastText',
    backgroundColor: theme.palette.success.main,
  },
})

type TProps = {
  status: keyof ReturnType<typeof st>
  containerStyle?: SxProps<Theme>
  labelStyle?: SxProps<Theme>
  type?: 'circle' | 'box'
}

export const EmbedStatus = ({
  status,
  type = 'box',
  containerStyle,
  labelStyle,
}: TProps) => {
  const theme = useTheme()
  const myStatus = st(theme)[status]

  if (!myStatus) return null

  if (type === 'circle') {
    return (
      <Stack height={1}>
        <Tooltip
          title={myStatus.label}
          sx={{
            textTransform: 'capitalize',
          }}
        >
          <Box
            sx={{
              borderRadius: '50%',
              width: 20,
              height: 20,
              m: '0px !important',
              my: 'auto',
              backgroundColor: alpha(myStatus?.backgroundColor, 0.2),
              ...containerStyle,
            }}
          ></Box>
        </Tooltip>
      </Stack>
    )
  }

  return (
    <Stack height={1}>
      <Stack
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1,
          px: 3,
          py: 0.5,
          borderRadius: 10,
          width: 'fit-content',
          backgroundColor: alpha(myStatus?.backgroundColor, 0.15),
          borderColor: myStatus?.backgroundColor,
          borderWidth: 1,
          borderStyle: 'solid',
          my: 'auto',
          ...containerStyle,
        }}
      >
        <Typography
          sx={{
            color: myStatus.backgroundColor,
            fontWeight: 'bold',
            textTransform: 'capitalize',
            userSelect: 'none',
            ...labelStyle,
          }}
        >
          {myStatus?.label || 'Não encontrado'}
        </Typography>
      </Stack>
    </Stack>
  )
}
