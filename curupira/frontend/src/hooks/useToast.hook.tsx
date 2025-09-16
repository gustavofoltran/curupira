import { createContext, useContext, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import {
  Alert,
  AlertColor,
  IconButton,
  Slide,
  SlideProps,
  Snackbar,
} from '@mui/material'

type ToastContextData = {
  createToast(message: string, severity?: AlertColor): void
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData)

type TransitionProps = Omit<SlideProps, 'direction'>

function TransitionRight(props: TransitionProps) {
  return <Slide {...props} direction="left" />
}

type ToastProviderProps = {
  children: React.ReactNode
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('success')

  const handleClose = () => {
    setMessage('')
  }

  const createToast = (message: string, severity: AlertColor) => {
    setMessage(message)
    setSeverity(severity)
  }

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  )

  return (
    <ToastContext.Provider value={{ createToast }}>
      {children}

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        data-cy="toast"
        open={!!message}
        autoHideDuration={3000}
        onClose={handleClose}
        action={action}
        TransitionComponent={TransitionRight}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextData {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

export { ToastProvider, useToast }
