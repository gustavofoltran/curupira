import { CloudUpload } from '@mui/icons-material'
import {
  alpha,
  Box,
  ButtonProps,
  FormHelperText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { get as _get } from 'lodash'
import { ReactNode, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { limitCaracters } from '~/utils/helpers'
import { useFormComponents } from './context/FormComponents.context'

type Props = Omit<
  ButtonProps,
  'children' | 'component' | 'id' | 'component' | 'fullWidth' | 'disabled'
> & {
  id: string
  accept?: string
  placeholder?: string
  helperText?: string
  disabled?: boolean
  fullWidth?: boolean
}

export const FormFileInput = (props: Props) => {
  useFormComponents()
  const {
    id,
    helperText,
    accept,
    placeholder = 'Carregar Arquivo...',
    fullWidth = true,
    disabled = false,
    ...rest
  } = props
  const theme = useTheme()
  const [buttonText, setButtonText] = useState<string>(placeholder)

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<any>()

  const watchComponent = watch(id) as File

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): File | undefined => {
    const { files } = e.target
    return files?.[0]
  }

  useEffect(() => {
    if (watchComponent) {
      const fileName = watchComponent?.name
      if (fileName) {
        setButtonText(limitCaracters(fileName, 20))
        if (fileName.length > 20) {
          setButtonText(limitCaracters(fileName, 20))
        }
      }
    } else {
      setButtonText(placeholder)
    }
  }, [watchComponent])

  const createPreview = (file: File) => {
    if (!file) return ''
    return URL.createObjectURL(file)
  }

  const hasError = !!_get(errors, `${id}.message`)
  return (
    <Controller
      name={id}
      control={control}
      defaultValue={''}
      render={({ field }) => (
        <Box component={'div'} height={1} width={1}>
          <Stack
            width={1}
            height={1}
            minHeight={250}
            border={'dashed'}
            borderColor={'primary.main'}
            borderRadius={4}
            position={'relative'}
          >
            {watchComponent?.type?.includes('image') ? (
              <img
                src={createPreview(watchComponent)}
                alt={watchComponent?.name}
                style={{
                  margin: 'auto',
                  width: '96%',
                  height: '96%',
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: 12,
                }}
              />
            ) : (
              <object
                height="90%"
                width="90%"
                style={{ margin: 'auto' }}
                data={createPreview(watchComponent)}
              ></object>
            )}
            <Box
              component={'label'}
              htmlFor={`${id}-hidden-input`}
              height={1}
              textAlign={'center'}
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              flexDirection={'column'}
              sx={{
                position: 'absolute',
                zIndex: 1,
                width: 1,
                color: watchComponent
                  ? 'transparent'
                  : theme.palette.primary.main,
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  color: watchComponent
                    ? 'white'
                    : theme.palette.background.default,
                  cursor: 'pointer',
                  backgroundColor: alpha(theme.palette.primary.main, 0.7),
                },
              }}
              {...rest}
            >
              <CloudUpload fontSize="large" />
              {watchComponent && (
                <>
                  <Typography variant="h5">Substituir</Typography>
                </>
              )}
              <Typography
                fontWeight={'bold'}
                sx={{
                  whiteSpace: 'nowrap',
                }}
              >
                {buttonText}
              </Typography>
              <FormHelperText sx={styles.helperText} error={hasError}>
                {hasError
                  ? (_get(errors, `${id}.message`) as ReactNode)
                  : helperText}
              </FormHelperText>
            </Box>
          </Stack>

          <input
            id={`${id}-hidden-input`}
            name={id}
            accept={accept}
            type="file"
            onChange={(e) => field.onChange(handleFileChange(e))}
            style={styles.none}
            disabled={disabled}
          />
        </Box>
      )}
    />
  )
}

const styles = {
  none: { display: 'none' },
  helperText: { ml: 2, mt: 0.5 },
  button: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}
