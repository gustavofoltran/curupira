import { History, Visibility } from '@mui/icons-material'
import {
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { useState } from 'react'
import { Dialog } from '~/components/Dialog/Dialog.component'

type TProps = {}

export const ModalAfterSaleHistory = ({}: TProps) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip title="Histórico Pós-Venda">
        <IconButton color="primary" onClick={handleOpen}>
          <History />
        </IconButton>
      </Tooltip>
      {open && <ModalComponent onClose={handleClose} />}
    </>
  )
}

type TModalComponent = {
  onClose: () => void
} & TProps

const ModalComponent = ({ onClose }: TModalComponent) => {
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
      <Dialog.Header
        title={'Histórico de Pós Venda'}
        onClose={onClose}
      ></Dialog.Header>
      <Dialog.Content dividers sx={{ padding: 0 }}>
        <Stack gap={4}>
          <Grid2 container xs={12} px={4} pt={4}>
            <Grid2 container xs={9}>
              <Grid2 xs={4} pr={2}>
                <Typography variant="h5">Produto</Typography>
                <Typography>Batata</Typography>
              </Grid2>
              <Grid2 xs={4} pr={2}>
                <Typography variant="h5">Tipo</Typography>
                <Typography>Doce</Typography>
              </Grid2>
              <Grid2 xs={4} pr={2}>
                <Typography variant="h5">Código do produto</Typography>
                <Typography>Code</Typography>
              </Grid2>
              <Grid2 xs={12} my={2} />
              <Grid2 xs={4} pr={2}>
                <Typography variant="h5">Cliente</Typography>
                <Typography>Code</Typography>
              </Grid2>
              <Grid2 xs={8} pr={2}>
                <Typography variant="h5">Venda ID</Typography>
                <Typography>Code</Typography>
              </Grid2>
            </Grid2>
            <Grid2 xs={3}>
              <Button fullWidth>
                <Visibility />
                <Typography variant="h6">Ver Vendas</Typography>
              </Button>
              <Button fullWidth sx={{ mt: 1 }}>
                <Visibility />
                <Typography variant="h6">Ver Produtos</Typography>
              </Button>
            </Grid2>
          </Grid2>
          <Divider />
          <Stack gap={2} pb={4} overflow={'auto'} height={1}>
            <EmptyHistory />
          </Stack>
        </Stack>
      </Dialog.Content>
    </Dialog>
  )
}

const EmptyHistory = () => {
  return (
    <Stack textAlign={'center'}>
      <Typography variant="h5">
        Esse produto ainda não possui histórico de pós-venda
      </Typography>
      <Typography variant="body1">
        Histórico só é gerado quando o status da venda muda para "Entregue"
      </Typography>
    </Stack>
  )
}
