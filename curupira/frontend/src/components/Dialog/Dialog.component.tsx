import {
  Dialog as DialogComponent,
  DialogContent,
  DialogProps,
} from '@mui/material'
import { DialogHeader } from './DialogHeader.component'

type Props = Omit<DialogProps, 'children' | 'style'> & {
  children: React.ReactNode
  onClose: () => void
}

export const Dialog = ({ children, open, onClose, ...rest }: Props) => {
  return (
    <DialogComponent open={open} onClose={onClose} sx={styles.dialog} {...rest}>
      {children}
    </DialogComponent>
  )
}

const styles = {
  dialog: {
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& .MuiGrid-root': {
      width: '100%',
      margin: 0,
    },
  },
}

Dialog.Header = DialogHeader
Dialog.Content = DialogContent
