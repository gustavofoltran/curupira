import { Yup } from '~/utils/formValidator'
import { TFormUserSettingsPassword } from '../ModalUserSettings.component'

export const userSettingsPasswordValidation =
  (): Yup.ObjectSchema<TFormUserSettingsPassword> => {
    return Yup.object().shape({
      password: Yup.string().min(6).required(),
      confirmPassword: Yup.string()
        .min(6)
        .required()
        .oneOf([Yup.ref('passwordUser')], 'As senhas devem ser iguais'),
    })
  }
