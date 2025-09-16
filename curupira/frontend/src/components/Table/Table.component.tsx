import { Stack, SxProps, Theme } from '@mui/material'
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridRowModel,
  GridRowsProp,
  GridValidRowModel,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { useEffect } from 'react'
import { TableColumsVisibility } from './TableColumsVisibility.component'

type TProps<T extends GridValidRowModel> = {
  columns: GridColDef<T>[]
  rows: GridRowsProp<T>
  pagination?: {
    handleParamChange: (params: any) => void
    params: any
    totalElements: number
  }
  hiddenToolbar?: boolean
  toolbar?: {
    containerProps?: SxProps<Theme>
    component: React.ReactNode
  }
  emptyMessage?: string
} & Omit<
  DataGridProps,
  | 'columns'
  | 'rows'
  | 'onPaginationModelChange'
  | 'slots'
  | 'paginationModel'
  | 'localeText'
  | 'hideFooterPagination'
  | 'pagination'
>

export const Table = <T extends GridValidRowModel>({
  columns,
  rows,
  pagination,
  toolbar: customToobar,
  loading,
  hiddenToolbar,
  emptyMessage = 'Nenhum registro encontrado',
  ...rest
}: TProps<T>) => {
  const styles = makeStyles()
  const apiRef = useGridApiRef()

  const customValueGetter = (value: string, row: any, params: GridRowModel) => {
    if (params.field.includes('.')) {
      const format = params.field.split('.')
      const nestedData = format.reduce(
        (obj: any, field: any) => obj && obj[field],
        row,
      )
      return nestedData
    }

    return value
  }

  useEffect(() => {
    if (pagination?.totalElements) {
      try {
        apiRef.current.setRowCount(pagination.totalElements)
      } catch {}
    }
  }, [pagination])

  return (
    <Stack position={'relative'}>
      <Stack
        direction={'row'}
        gap={1}
        sx={{
          width: 'calc(100% - 50px)',
          right: 50,
          position: 'absolute',
          display: 'flex',
          top: -27,
          gap: 1,
          ...customToobar?.containerProps,
        }}
      >
        {customToobar?.component}
      </Stack>
      <DataGrid
        apiRef={apiRef}
        columns={columns.map((column) => ({
          ...column,
          valueGetter: customValueGetter,
        }))}
        rows={rows}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        loading={loading}
        slots={{
          toolbar: hiddenToolbar ? undefined : () => <CustomToolbar />,
          noRowsOverlay: () => CustomNoRowsOverlay(emptyMessage),
        }}
        initialState={{
          pagination: {
            paginationModel: {
              page: pagination?.params.pageNumber,
              pageSize: pagination?.params.pageSize,
            },
          },
        }}
        onPaginationModelChange={(value) => {
          if (!pagination) return
          pagination.handleParamChange({
            pageNumber: value.page,
            pageSize: value.pageSize,
          })
        }}
        paginationMode="server"
        pageSizeOptions={[5, 10, 25, 50]}
        density="compact"
        autoHeight
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        sx={styles.dataGrid}
        rowHeight={70}
        hideFooter={pagination ? false : true}
        {...rest}
      />
    </Stack>
  )
}

type TCustomToolbarProps = {
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}

const CustomToolbar = ({ containerProps }: TCustomToolbarProps) => {
  const apiRef = useGridApiContext()

  return (
    <Stack
      direction={'row'}
      sx={{
        p: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        top: -60,
        gap: 1,
      }}
      {...containerProps}
    >
      <TableColumsVisibility apiRef={apiRef} />
      {/* <TableDownload apiRef={apiRef} /> */}
    </Stack>
  )
}

const CustomNoRowsOverlay = (message: string) => {
  return (
    <Stack
      sx={{
        m: 'auto',
        width: 1,
        height: 1,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'secondary.main',
        fontWeight: 'bold',
      }}
    >
      {message}
    </Stack>
  )
}

const makeStyles = () => {
  return {
    dataGrid: {
      outline: 'none',
      backgroundColor: 'background.paper',
      boxShadow: 'none',
      mt: 4,
      '& .MuiDataGrid-container--top': {
        backgroundColor: '#F0F4F8',
      },
      '& .MuiDataGrid-container--top [role=row]': {
        backgroundColor: '#F0F4F8',
      },
      // '& .MuiDataGrid-columnHeader': {
      //   p: '0.5rem 1rem',
      // },
      '& .MuiDataGrid-columnHeaderTitle': {
        color: 'text.primary',
        fontWeight: 'bold',
      },
      '&.MuiDataGrid-root .MuiDataGrid-cell:focus ': {
        outline: 'none !important',
      },
      '& .MuiDataGrid-cell': {
        display: 'flex',
        alignItems: 'center',
        py: 0.5,
      },
      '& .MuiDataGrid-columnHeader:focus': {
        outline: 'none !important',
      },
      '& .MuiDataGrid-columnHeader:focus-within': {
        outline: 'none !important',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
      '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
        outline: 'none !important',
      },
      // '& .MuiDataGrid-overlayWrapper': {
      //   height: 40,
      // },
      '.MuiDataGrid-footerContainer': {
        height: 39,
        minHeight: 'auto',
      },
      '.MuiDataGrid-filler': {
        height: '15px !important',
      },
    },
  }
}
