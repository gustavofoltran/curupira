import { Box, BoxProps } from '@mui/material'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { FormComponentsProvider } from './context/FormComponents.context'
import { FormOnlyNumbersLettersTextInput } from './Form.OnlyNumbersLettersTextInput.component'
import { FormAutocompleteInput } from './FormAutocompleteInput.component'
import { FormAutocompleteMultipleInput } from './FormAutocompleteMultipleInput.component'
import { FormCheckbox } from './FormCheckbox.component'
import { FormControlledTextInput } from './FormControlledTextInput.component'
import { FormCurrencyInput } from './FormCurrencyInput.component'
import { FormDatePickerInput } from './FormDatePickerInput.component'
import { FormDateTimePickerInput } from './FormDateTimePickerInput.component'
import { FormMaskedTextInput } from './FormMaskedTextInput.component'
import { FormMultipleAutocompleteInput } from './FormMultipleAutocompleteInput.component'
import { FormNumericControlledTextInput } from './FormNumericControlledTextInput.component'
import { FormPercentageInput } from './FormPercentageInput.component'
import { FormRadioGroup } from './FormRadioGroup.componen'
import { FormSelectInput } from './FormSelectInput.component'
import { FormSubmitBtn } from './FormSubmitBtn.component'
import { FormSwitchInput } from './FormSwitchInput.component'
import { FormTextEditorInput } from './FormTextEditorInput.component'
import { FormTextInput } from './FormTextInput.component'

type Props = Omit<BoxProps, 'onSubmit' | 'id' | 'handler' | 'children'> & {
  handler: UseFormReturn<any, any>
  id: string
  onSubmit: (data: any) => Promise<any>
  children: React.ReactNode
}

export const Form = ({ children, handler, onSubmit, id, ...rest }: Props) => {
  const { handleSubmit } = handler

  return (
    <FormProvider {...handler}>
      <FormComponentsProvider>
        <Box
          onSubmit={handleSubmit(async (data: any) => {
            try {
              await onSubmit(data)
            } catch (error) {}
          })}
          id={id}
          component="form"
          autoComplete="off"
          {...rest}
        >
          {children}
        </Box>
      </FormComponentsProvider>
    </FormProvider>
  )
}

Form.SubmitBtn = FormSubmitBtn
Form.TextInput = FormTextInput
Form.SelectInput = FormSelectInput
Form.DatePickerInput = FormDatePickerInput
Form.DateTimePickerInput = FormDateTimePickerInput
Form.MaskedTextInput = FormMaskedTextInput
Form.SwitchInput = FormSwitchInput
Form.ControlledTextInput = FormControlledTextInput
Form.CurrencyInput = FormCurrencyInput
Form.Checkbox = FormCheckbox
Form.PercentageInput = FormPercentageInput
Form.AutocompleteInput = FormAutocompleteInput
Form.AutocompleteMultipleInput = FormAutocompleteMultipleInput
Form.OnlyNumbersLettersTextInput = FormOnlyNumbersLettersTextInput
Form.RadioGroup = FormRadioGroup
Form.MultipleAutoCompleteInput = FormMultipleAutocompleteInput
Form.NumericControlledTextInput = FormNumericControlledTextInput
Form.TextEditor = FormTextEditorInput