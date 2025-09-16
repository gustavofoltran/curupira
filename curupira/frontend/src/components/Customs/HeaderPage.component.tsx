import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

type TProps = {
  title: string
  children?: React.ReactNode
}

export const HeaderPage = ({ title, children }: TProps) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment && isNaN(segment as any))

  const segmentsToShow = pathSegments.slice(0, -1)

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      <Stack>
        <Stack direction={'row'} alignItems={'center'} gap={2}>
          {segmentsToShow.map((segment, index) => {
            const pathToSegment = `/${pathSegments.slice(0, index + 1).join('/')}`

            return (
              <Typography
                key={index}
                variant="h6"
                component={Link}
                to={pathToSegment}
                sx={{ color: 'secondary.main' }}
              >
                {t(segment)}
              </Typography>
            )
          })}
        </Stack>

        <Typography variant="h4">{title}</Typography>
      </Stack>
      {children}
    </Stack>
  )
}
