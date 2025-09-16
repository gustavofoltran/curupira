import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { DialogTitle, IconButton, Tooltip, Typography } from '@mui/material'
import Box from '@mui/material/Box/Box'

export interface DialogTitleProps {
  id?: string
  title: string
  children?: React.ReactNode
  onReceipt?: () => void
  onClose?: () => void
  onDownload?: () => void
}

export const DialogHeader = (props: DialogTitleProps) => {
  const { title, children, onClose, onReceipt, onDownload } = props

  return (
    <DialogTitle
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        m: 0,
        p: 3,
        py: 1,
      }}
    >
      <Typography variant="h5">{title}</Typography>
      {children}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {onReceipt ? (
          <Tooltip title="Ver Comprovante">
            <IconButton
              onClick={onReceipt}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <ReceiptIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        {onDownload ? (
          <Tooltip title="Fazer Download">
            <IconButton
              onClick={onDownload}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        {onClose ? (
          <Tooltip title="Fechar">
            <IconButton
              onClick={onClose}
              sx={{
                ml: 2,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
    </DialogTitle>
  )
}
