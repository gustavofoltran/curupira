import { FileUploadOutlined } from '@mui/icons-material'
import { Button } from '@mui/material'
import { GridRowModel } from '@mui/x-data-grid'

import { base64toBlob, limitCaracters } from '~/utils/helpers'

export const renderEditCellFile = ({ params }: { params: GridRowModel }) => {
  return (
    <>
      <label
        htmlFor={`file-input-${params.id}`}
        style={{
          width: '100%',
          paddingRight: '1rem',
        }}
      >
        <Button
          endIcon={<FileUploadOutlined />}
          color="primary"
          component="span"
          sx={{
            width: 1,
            height: '100%',
            outline: 'none',
            mx: 1,
            py: 0.3,
          }}
        >
          {params.value.name
            ? limitCaracters(params.value.name, 15)
            : limitCaracters(
                new File([base64toBlob(params.value)], 'Comprovante', {
                  type: 'application/pdf',
                }).name,
                15,
              )}
        </Button>
      </label>
      <input
        id={`file-input-${params.id}`}
        accept={'application/pdf'}
        type="file"
        // onChange={(e) => field.onChange(handleFileChange(e))}
        onChange={(e) => {
          const { files } = e.target
          if (files) {
            const value = files[0]
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value,
            })
          }
        }}
        style={{ display: 'none' }}
      />
    </>
  )
}
