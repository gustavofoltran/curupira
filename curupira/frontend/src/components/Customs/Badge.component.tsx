import { Box, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

type TProps = {
  title: string
}

export const Badge = ({ title }: TProps) => {
  return (
    <Box
      sx={{
        fontWeight: 'bold',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: grey[500],
        backgroundColor: grey[200],
        borderRadius: 100,
        px: 2,
        py: 0.5,
      }}
    >
      <Typography variant="body1">{title}</Typography>
    </Box>
  )
}
