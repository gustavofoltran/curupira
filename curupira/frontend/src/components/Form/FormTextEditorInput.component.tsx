import { FormControl, FormHelperText } from '@mui/material'
import { get as _get } from 'lodash'
import { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useFormComponents } from './context/FormComponents.context'

type Props = {
  id: string
  label: string
  defaultValue?: string
}

export const FormTextEditorInput = (props: Props) => {
  useFormComponents()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  const { id, label, defaultValue = '' } = props

  return (
    <FormControl
      fullWidth
      size="small"
      sx={{
        mb: _get(errors, `${id}.message`) ? 5 : 3,
        '& .ql-toolbar.ql-snow': {
          borderTopRightRadius: '4px',
          borderTopLeftRadius: '4px',
          borderColor: errors[id] ? 'red' : 'none',
        },
        '& .ql-container.ql-snow': {
          borderBottomRightRadius: '4px',
          borderBottomLeftRadius: '4px',
          borderColor: errors[id] ? 'red' : 'none',
        },
      }}
    >
      <Controller
        name={id}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => <ReactQuill placeholder={label} {...field} />}
      ></Controller>
      <FormHelperText
        error
        sx={{
          position: 'absolute',
          bottom: '-25px',
        }}
      >
        {_get(errors, `${id}.message`) as ReactNode}
      </FormHelperText>
    </FormControl>
  )
}
