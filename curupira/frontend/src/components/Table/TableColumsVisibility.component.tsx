import { ViewWeek } from '@mui/icons-material'
import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
  Stack,
  Tooltip,
} from '@mui/material'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import { useState } from 'react'

type TProps = {
  apiRef: React.MutableRefObject<GridApiCommunity>
}

export const TableColumsVisibility = ({ apiRef }: TProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const columns = apiRef.current.getVisibleColumns()

  return (
    <>
      <Tooltip title="Colunas">
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          color="primary"
        >
          <ViewWeek />
        </IconButton>
      </Tooltip>

      <Popover
        id="columns-popover"
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        style={{
          marginTop: '4px',
        }}
      >
        <FormGroup>
          <Stack sx={{ px: 2, py: 1 }}>
            {apiRef.current.getAllColumns().map((column, index) => (
              <FormControlLabel
                key={index}
                name={column.field}
                control={
                  <Checkbox
                    checked={columns.some((c) => c.field === column.field)}
                    onClick={() => {
                      const isVisible = apiRef.current
                        .getVisibleColumns()
                        .some((c) => c.field === column.field)
                      apiRef.current.setColumnVisibility(
                        column.field,
                        !isVisible,
                      )
                    }}
                  />
                }
                label={column.headerName}
              />
            ))}
          </Stack>
          <Divider />
          <FormControlLabel
            label={'Mostrar/Esconder Todas'}
            sx={{
              px: 2,
              py: 1,
            }}
            control={
              <Checkbox
                checked={
                  columns.length === apiRef.current.getAllColumns().length
                }
                onClick={() => {
                  const isVisible =
                    columns.length === apiRef.current.getAllColumns().length
                  apiRef.current.getAllColumns().forEach((column) => {
                    apiRef.current.setColumnVisibility(column.field, !isVisible)
                  })
                }}
              />
            }
          />
        </FormGroup>
      </Popover>
    </>
  )
}
