import { Box, Stack, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import BrasilFlag from '~/assets/languages/brasil.png'
import EuaFlag from '~/assets/languages/eua.png'
import SpainFlag from '~/assets/languages/spain.png'
import { ELanguage } from '~/types/enums/ELanguage.enum'

export const I18nFlags = () => {
  const { i18n } = useTranslation()

  function handleChangeLanguage(language: string) {
    i18n.changeLanguage(language)
  }

  const selectedLanguage = i18n.language

  return (
    <Stack
      direction={'row'}
      gap={2}
      height={30}
      justifyContent={'center'}
      mt={2}
    >
      <Tooltip title="Português">
        <Box height={'auto'}>
          <Flag
            image={BrasilFlag}
            isSelected={selectedLanguage === ELanguage.PT_BR}
            onClick={() => handleChangeLanguage(ELanguage.PT_BR)}
          />
        </Box>
      </Tooltip>
      <Tooltip title="Inglês">
        <Box height={'auto'}>
          <Flag
            image={EuaFlag}
            isSelected={selectedLanguage === ELanguage.EN_US}
            onClick={() => handleChangeLanguage(ELanguage.EN_US)}
          />
        </Box>
      </Tooltip>
      <Tooltip title="Espanhol">
        <Box height={'auto'}>
          <Flag
            image={SpainFlag}
            isSelected={selectedLanguage === ELanguage.ES_ES}
            onClick={() => handleChangeLanguage(ELanguage.ES_ES)}
          />
        </Box>
      </Tooltip>
    </Stack>
  )
}

type TProps = {
  image: string
  isSelected: boolean
  onClick: () => void
}

export const Flag = ({ image, isSelected, ...props }: TProps) => (
  <img
    alt="flag"
    src={image}
    className={isSelected ? 'flag selected' : 'flag'}
    style={{ cursor: 'pointer', height: '100%' }}
    {...props}
  />
)
