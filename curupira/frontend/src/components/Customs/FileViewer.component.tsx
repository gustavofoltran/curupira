import { Delete, Download } from '@mui/icons-material'
import {
  alpha,
  Box,
  Button,
  IconButton,
  Stack,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { useState } from 'react'
import { useToast } from '~/hooks/useToast.hook'
import { limitCaracters } from '~/utils/helpers'
import { Dialog } from '../Dialog/Dialog.component'

type TProps = {
  id: number
  url: string
  name: string
  extension: string
  onDelete: (id: number) => void
}

export const FileViewer = ({ id, url, onDelete, name, extension }: TProps) => {
  const { createToast } = useToast()
  const theme = useTheme()
  const styles = makeStyles(theme)
  const [modalDetete, setModalDelete] = useState(false)
  const imageExtensions = ['png', 'jpg', 'jpeg']
  const isImage = imageExtensions.includes(extension)

  const handleDelete = () => {
    onDelete(id)
    setModalDelete(true)
  }

  const handleClose = () => {
    setModalDelete(false)
  }

  const handleDownload = (url: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.download = `${name}.${extension}`
        document.body.appendChild(link)

        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      })
      .catch(() => {
        createToast('Erro ao baixar imagem', 'error')
      })
  }

  return (
    <>
      <Box position={'relative'}>
        <Stack
          component={'button'}
          form="delete-image"
          sx={styles.containerButtons}
        >
          <Tooltip title="Deletar">
            <IconButton
              onClick={() => {
                setModalDelete(true)
              }}
            >
              <Delete
                color="error"
                sx={{
                  fontSize: 20,
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Baixar">
            <IconButton
              onClick={() => {
                if (isImage) {
                  handleDownload(url)
                  return
                }
                window.open(url)
              }}
            >
              <Download
                color="primary"
                sx={{
                  fontSize: 20,
                }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
        {isImage ? (
          <Stack>
            <Stack
              component={'a'}
              target="_blank"
              href={url}
              sx={styles.containerImage}
            >
              <Typography
                variant="h6"
                textAlign={'center'}
                bgcolor={'background.default'}
                px={1}
                borderRadius={2}
              >
                {limitCaracters(`${name}.${extension}`, 25)}
              </Typography>
            </Stack>
            <img
              src={url}
              alt={name}
              style={{
                width: 300,
                height: 300,
                objectFit: 'cover',
                position: 'absolute',
                zIndex: 0,
                borderRadius: 8,
              }}
            />
          </Stack>
        ) : (
          <Stack width={300} position={'relative'} overflow={'hidden'}>
            <Stack
              component={'a'}
              target="_blank"
              href={url}
              sx={styles.containerImage}
            >
              <Typography
                variant="h6"
                textAlign={'center'}
                bgcolor={'background.default'}
                px={1}
                borderRadius={2}
              >
                {limitCaracters(`${name}.${extension}`, 25)}
              </Typography>
            </Stack>
            <iframe
              src={url + '#toolbar=0'}
              style={{
                width: 315,
                height: 315,
                objectFit: 'cover',
                position: 'absolute',
                zIndex: 0,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            />
          </Stack>
        )}
      </Box>
      {modalDetete && (
        <ModalComponent
          onClose={handleClose}
          onDelete={handleDelete}
          name={name}
          extension={extension}
        />
      )}
    </>
  )
}

type TModalComponent = {
  onClose: () => void
  onDelete: () => void
  name: string
  extension: string
}

const ModalComponent = ({
  onDelete,
  onClose,
  name,
  extension,
}: TModalComponent) => {
  const imageExtensions = ['png', 'jpg', 'jpeg']
  const isImage = imageExtensions.includes(extension)
  const handleDelete = async () => {
    onDelete()
  }

  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: '30%',
        },
      }}
    >
      <Dialog.Header
        title={`Deletar ${isImage ? 'Imagem' : 'Arquivo'}`}
        onClose={onClose}
      ></Dialog.Header>
      <Dialog.Content dividers>
        <Stack gap={4}>
          <Typography>
            Tem certeza que deseja deletar <b>{name + '.' + extension}?</b>{' '}
            <br /> Essa ação não pode ser desfeita.
          </Typography>
          <Stack direction={'row'} gap={2}>
            <Button onClick={handleDelete} color="error" fullWidth>
              Deletar
            </Button>
            <Button onClick={onClose} variant="outlined" fullWidth>
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Dialog.Content>
    </Dialog>
  )
}

const makeStyles = (theme: Theme) => ({
  containerFile: {
    height: 300,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    borderRadius: 2,
    border: 2,
    textDecoration: 'none',
    transition: 'all .3s',
    ':hover': {
      background: alpha(theme.palette.primary.main, 0.2),
      cursor: 'pointer',
    },
  },
  containerImage: {
    height: 300,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.primary.main,
    borderRadius: 2,
    zIndex: 1,
    textDecoration: 'none',
    transition: 'all .3s',
    opacity: 0,
    ':hover': {
      background: alpha(theme.palette.primary.main, 0.2),
      cursor: 'pointer',
      opacity: 100,
    },
  },
  containerButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 2,
    color: theme.palette.primary.main,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    m: 0.5,
    p: 0,
    backgroundColor: theme.palette.background.paper,
  },
})
