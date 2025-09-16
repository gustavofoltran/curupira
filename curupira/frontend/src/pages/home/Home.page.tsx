import { Stack, Typography } from '@mui/material'

export const HomePage = () => {
  return (
    <Stack gap={4}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Typography variant="h4">Bem vindo a SETUP</Typography>
      </Stack>
    </Stack>
  )
}
