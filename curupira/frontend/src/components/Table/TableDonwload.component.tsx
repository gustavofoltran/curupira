import { Download, Print, SimCardDownload } from '@mui/icons-material'
import { Button, FormGroup, IconButton, Popover, Tooltip } from '@mui/material'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import { useState } from 'react'

type TProps = {
  apiRef: React.MutableRefObject<GridApiCommunity>
}

export const TableDownload = ({ apiRef }: TProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  return (
    <>
      <Tooltip title="Baixar">
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          color="primary"
        >
          <Download />
        </IconButton>
      </Tooltip>

      <Popover
        id="download-popover"
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
        <FormGroup sx={{ p: 1, gap: 1 }}>
          <Button
            variant="text"
            onClick={() => {
              apiRef.current.exportDataAsCsv()
            }}
            startIcon={<SimCardDownload />}
          >
            Baixar CSV
          </Button>
          <Button
            variant="text"
            onClick={() => {
              apiRef.current.exportDataAsPrint()
            }}
            startIcon={<Print />}
          >
            Imprimir
          </Button>
        </FormGroup>
      </Popover>
    </>
  )
}
