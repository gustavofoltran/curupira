import { Button, ButtonProps, CircularProgress } from '@mui/material'
import { UseFormReturn } from 'react-hook-form'
import { useFormComponents } from './context/FormComponents.context'

type Props = {
  children: React.ReactNode
  form: string
  btnProps?: ButtonProps
  handler: UseFormReturn<any, any>
}

export const FormSubmitBtn = (props: Props) => {
  useFormComponents()
  const { children, form, btnProps, handler } = props
  const {
    formState: { isValidating, isSubmitting },
  } = handler

  const isLoading = isValidating || isSubmitting

  const loading = (
    <>
      <CircularProgress color="inherit" size={20} sx={{ mr: 1.5 }} />
      Enviando...
    </>
  )

  return (
    <Button
      id="submit"
      type="submit"
      size="large"
      disabled={isSubmitting}
      sx={{ fontWeight: 700 }}
      {...btnProps}
      form={form}
    >
      {isLoading ? loading : children}
    </Button>
  )
}
