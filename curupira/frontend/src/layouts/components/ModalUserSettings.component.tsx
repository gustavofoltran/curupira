import { yupResolver } from '@hookform/resolvers/yup'
import { Settings } from '@mui/icons-material'
import { ListItemIcon, MenuItem, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog } from '~/components/Dialog/Dialog.component'
import { Form } from '~/components/Form'
import { cellPhoneInputMask } from '~/utils/inputMasks'
import { userSettingsInfoValidation } from './validations/userSettingsInfo.validation'
import { userSettingsPasswordValidation } from './validations/userSettingsPassword.validation'

export const ModalUserSettings = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Configurações
      </MenuItem>
      {open && <ModalComponent onClose={handleClose} />}
    </>
  )
}

type TModalComponent = {
  onClose: () => void
}

export type TFormUserSettingsInfo = {
  name: string
  email: string
  phone: string
  image: File
}

export type TFormUserSettingsPassword = {
  password: string
  confirmPassword: string
}

const ModalComponent = ({ onClose }: TModalComponent) => {
  const formHandlerInfo = useForm<TFormUserSettingsInfo>({
    resolver: yupResolver(userSettingsInfoValidation()),
  })
  const formHandlerPassword = useForm<TFormUserSettingsPassword>({
    resolver: yupResolver(userSettingsPasswordValidation()),
  })

  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 'md',
        },
      }}
    >
      <Dialog.Header title="Configurações" onClose={onClose} />
      <Dialog.Content dividers>
        <Form
          id="form-user-settings-info"
          handler={formHandlerInfo}
          onSubmit={async (data) => {
            console.log(data)
          }}
        >
          <Grid2 container xs={12}>
            <Grid2 xs={3}>
              <img
                src="https://via.placeholder.com/150"
                alt="User"
                width={'90%'}
                height={'auto'}
              />
            </Grid2>
            <Grid2 container xs={9} columnSpacing={2}>
              <Grid2 xs={12} mb={2}>
                <Typography variant="h5">Informações Pessoais</Typography>
                <Typography>Atualize suas informações pessoais.</Typography>
              </Grid2>
              <Grid2 xs={12}>
                <Form.TextInput id="name" label="Nome" />
              </Grid2>
              <Grid2 xs={6}>
                <Form.TextInput id="email" label="E-mail" />
              </Grid2>
              <Grid2 xs={6}>
                <Form.MaskedTextInput
                  id="phone"
                  label="Telefone"
                  mask={cellPhoneInputMask}
                />
              </Grid2>
            </Grid2>
            <Grid2
              xs={12}
              sx={{
                justifyContent: 'flex-end',
                display: 'flex',
              }}
            >
              <Form.SubmitBtn
                form="form-user-settings-info"
                handler={formHandlerInfo}
              >
                Atualizar
              </Form.SubmitBtn>
            </Grid2>
          </Grid2>
        </Form>
        <Form
          id="form-user-settings-password"
          handler={formHandlerPassword}
          onSubmit={async (data) => {
            console.log(data)
          }}
        >
          <Grid2 container columnSpacing={2}>
            <Grid2 xs={12} mb={2}>
              <Typography variant="h5">Alterar Senha</Typography>
              <Typography>
                Para alterar a senha, preencha os campos abaixo.
              </Typography>
            </Grid2>
            <Grid2 xs={6}>
              <Form.TextInput
                id="password"
                label="Senha"
                type="password"
                autoComplete="current-password"
              />
            </Grid2>
            <Grid2 xs={6}>
              <Form.TextInput
                id="confirmPassword"
                label="Repita a Senha"
                type="password"
                autoComplete="current-password"
              />
            </Grid2>
            <Grid2
              xs={12}
              sx={{
                justifyContent: 'flex-end',
                display: 'flex',
              }}
            >
              <Form.SubmitBtn
                form="form-user-settings-password"
                handler={formHandlerPassword}
              >
                Atualizar
              </Form.SubmitBtn>
            </Grid2>
          </Grid2>
        </Form>
      </Dialog.Content>
    </Dialog>
  )
}
