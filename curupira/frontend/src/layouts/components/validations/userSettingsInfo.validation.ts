import { Yup } from '~/utils/formValidator'
import { TFormUserSettingsInfo } from '../ModalUserSettings.component'

export const userSettingsInfoValidation =
  (): Yup.ObjectSchema<TFormUserSettingsInfo> => {
    return Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      phone: Yup.string().required(),
      image: Yup.mixed<File>()
        .required('Imagem é obrigatória')
        .test('fileType', 'Formato de arquivo não suportado', (value) => {
          return value instanceof File
        }),
    })
  }
