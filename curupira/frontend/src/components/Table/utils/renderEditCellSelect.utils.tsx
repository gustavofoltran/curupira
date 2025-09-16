import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { GridRowModel } from '@mui/x-data-grid'

export const renderEditCellSelect = (
  params: GridRowModel,
  values?: {
    value: string | number | readonly string[] | undefined
    label: string
    disabled?: boolean
  }[],
) => {
  return (
    <FormControl fullWidth>
      <InputLabel id={'asd'}>STATUS</InputLabel>
      <Select
        label={'Status'}
        placeholder="asda"
        id="asd"
        value={params.value}
        onChange={(newValue) => {
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            newValue,
          })
        }}
        sx={{
          height: 40,
        }}
      >
        {values?.map((value, index) => (
          <MenuItem
            key={index}
            data-cy={`${value.value}-select-item`}
            value={value.value}
            disabled={value.disabled}
          >
            {value.label}
          </MenuItem>
        )) ?? []}
      </Select>
    </FormControl>
  )
}
