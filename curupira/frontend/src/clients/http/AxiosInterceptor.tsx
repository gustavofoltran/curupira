import CloseIcon from '@mui/icons-material/Close'
import {
  Alert,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  SlideProps,
  Snackbar,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { AxiosError, AxiosResponse } from 'axios'
import { useLayoutEffect, useState } from 'react'
import error from '~/assets/error.png'
import httpClient from './http.client'

type TError = Record<string, string>

type Props = {
  children: React.ReactNode
}

type TransitionProps = Omit<SlideProps, 'direction'>

function TransitionRight(props: TransitionProps) {
  return <Slide {...props} direction="left" />
}

const errors: TError = {
  // 400: 'Ocorreu um erro. Tente novamente!',
  401: 'Não autorizado!',
  403: 'Você não possui permissão para acessar este recurso!',
  404: 'Desculpe. Não encontrado!',
  500: 'Opss! Ocorreu um erro interno. Tente novamente mais tarde!',
}

const AxiosInterceptor = ({ children }: Props) => {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(0)
  const [flagError, setFlagError] = useState(false)
  const [open, setOpen] = useState(false)

  useLayoutEffect(() => {
    const resInterceptor = (response: AxiosResponse) => {
      return response
    }

    const errInterceptor = (error: AxiosError<any>) => {
      if (error?.response?.status) {
        let errorMessage = errors[error.response.status]

        setMessage(errorMessage)
        setStatus(error.response.status)
        setFlagError(!flagError)
        setOpen(true)
      }
      return Promise.reject(error.response?.data)
    }

    const interceptor = httpClient.interceptors.response.use(
      resInterceptor,
      errInterceptor,
    )

    return () => httpClient.interceptors.response.eject(interceptor)
  }, [message, flagError])

  const handleClose = () => {
    setMessage('')
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
    <>
      {status === 400 && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={!!message}
          autoHideDuration={3000}
          onClose={handleClose}
          action={action}
          TransitionComponent={TransitionRight}
        >
          <Alert onClose={handleClose} severity="error" sx={styles.alert}>
            {message}
          </Alert>
        </Snackbar>
      )}
      {[401, 403, 404, 500].includes(status) && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogContent sx={styles.dialogContent}>
            <Box sx={styles.closeIconContainer}>
              <CloseIcon onClick={() => setOpen(false)} />
            </Box>
            <Box sx={styles.textContent}>
              <Typography variant={'h3'}>{status}</Typography>
              <Typography>{message}</Typography>
            </Box>
            <img src={error} alt="error" width={400} />
          </DialogContent>
        </Dialog>
      )}
      {children}
    </>
  )
}

export default AxiosInterceptor

const styles = {
  alert: { width: '100%' },
  dialogContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    py: 6,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    color: 'grey.500',
  },
  textContent: {
    position: 'absolute',
    top: 16,
    textAlign: 'center',
  },
}
