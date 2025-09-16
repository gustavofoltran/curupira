import { WarningAmberOutlined } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'

export const NotFound = () => {
  return (
    <Stack
      position={'absolute'}
      sx={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      <WarningAmberOutlined
        color="primary"
        sx={{ fontSize: 124, mx: 'auto', mb: 2 }}
      />
      <Typography variant="h2" color={'primary'} mb={2} noWrap>
        Página não encontrada
      </Typography>
    </Stack>
  )
}
