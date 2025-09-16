import { Delete } from '@mui/icons-material'
import { Button, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { Dialog } from '~/components/Dialog/Dialog.component'

type TProps = {
  title: string
  onDelete: () => Promise<void>
  labelDelete?: string
  labelCancel?: string
  children?: React.ReactNode
  tooltip?: string
  message?: string
}

export const ModalDelete = ({
  tooltip = 'Excluir',
  title,
  labelDelete = 'Excluir',
  labelCancel = 'Cancelar',
  onDelete,
  message,
  children = (
    <Typography>
      {message ? message : 'Tem certeza que deseja excluir?'}
    </Typography>
  ),
}: TProps) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton onClick={handleOpen} color="error">
          <Delete />
        </IconButton>
      </Tooltip>
      {open && (
        <ModalComponent
          title={title}
          onDelete={onDelete}
          children={children}
          labelDelete={labelDelete}
          labelCancel={labelCancel}
          onClose={handleClose}
        />
      )}
    </>
  )
}

type TModalComponent = {
  onClose: () => void
} & TProps

const ModalComponent = ({
  title,
  onDelete,
  labelDelete,
  labelCancel,
  children,
  onClose,
}: TModalComponent) => {
  const handleDelete = async () => {
    await onDelete()
    onClose()
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
      <Dialog.Header title={title} onClose={onClose}></Dialog.Header>
      <Dialog.Content dividers>
        <Stack gap={4}>
          {children}
          <Stack direction={'row'} gap={2}>
            <Button onClick={onClose} variant="outlined" fullWidth>
              {labelCancel}
            </Button>
            <Button onClick={handleDelete} color="error" fullWidth>
              {labelDelete}
            </Button>
          </Stack>
        </Stack>
      </Dialog.Content>
    </Dialog>
  )
}
