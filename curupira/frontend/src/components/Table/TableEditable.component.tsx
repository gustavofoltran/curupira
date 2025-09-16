import * as React from 'react'

import CancelIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { Box, InputProps, TypographyProps } from '@mui/material'
import {
  DataGrid,
  DataGridProps,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
} from '@mui/x-data-grid'

import { formatDateStringDDMMYYYY } from '~/utils/helpers'

import { Delete } from '@mui/icons-material'
import {
  valueGetter,
  valueGetterCurrency,
  valueGetterDate,
  valueGetterPercentage,
} from './utils'
import { renderEditCellCurrency } from './utils/renderEditCellCurrency.utils'
import { renderEditCellDate } from './utils/renderEditCellDate.utils'
import { renderEditCellPercentage } from './utils/renderEditCellPercentage.utils'
import { renderEditCellTextField } from './utils/renderEditCellTextField.utils'

export type THeaderTableEditable = Omit<
  GridColDef,
  'renderEditCell' | 'preProcessEditCellProps' | 'type'
> & {
  type:
    | 'currency'
    | 'number'
    | 'date'
    | 'singleSelect'
    | 'string'
    | 'actions'
    | 'file'
    | 'percentage'
    | 'status'
  placeholder?: string
  renderEditCell?: (params: any) => React.ReactNode
  preProcessEditCellProps?: (params: any) => any
  getActions?: (params: any) => React.ReactNode
  valueOptions?: string[]
  InputProps?: InputProps
}

type TProps = {
  rows: any
  fixedBottomRow?: {
    title: string
    columns: string[]
    typographyProps?: TypographyProps
  }
  header: THeaderTableEditable[]
  pagination?: {
    handleParamChange: any
    queryParam: any
    isLoading: boolean
    totalElements: number
  }
  onDelete?: (id: any, data: any) => void
  onSaveEdit?: (params: any) => void
  sx?: any
} & Omit<
  DataGridProps,
  'rows' | 'columns' | 'editMode' | 'onRowEditStop' | 'sx' | 'style'
>

export default function TableEditable(props: TProps) {
  const {
    rows: dataRows,
    header,
    onDelete,
    onSaveEdit,
    pagination,
    fixedBottomRow,
    sx,
    ...rest
  } = props
  const [rows, setRows] = React.useState<GridRowsProp>(dataRows)
  const [columns, setColumns] = React.useState<GridColDef[]>([])
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({
    static: { mode: GridRowModes.View },
  })

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId, data: GridRowModel) => async () => {
    onDelete && onDelete(id, data)
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.id === id)
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false }
    onSaveEdit && onSaveEdit(updatedRow)
    return updatedRow
  }

  React.useEffect(() => {
    const newHeader = header.map((column) => {
      switch (column.type) {
        case 'currency':
          return {
            flex: 1,
            ...column,
            valueGetter: valueGetterCurrency,
            renderEditCell: (params: GridRowModel) => {
              return renderEditCellCurrency(params, column.InputProps)
            },
            valueFormatter(params: any) {
              return `R$ ${params.value}`
            },
          }
        case 'percentage':
          return {
            flex: 1,
            ...column,
            valueGetter: valueGetterPercentage,
            renderEditCell: (params: GridRowModel) => {
              return renderEditCellPercentage(params, column.InputProps)
            },
            valueFormatter(params: any) {
              return `${params.value}%`
            },
          }
        case 'date':
          return {
            flex: 1,
            ...column,
            type: 'string',
            valueGetter: valueGetterDate,
            valueFormatter(params: any) {
              return formatDateStringDDMMYYYY(params.value, '/')
            },
            renderEditCell: (params: GridRowModel) => {
              return renderEditCellDate(params, column.InputProps)
            },
          }
        case 'singleSelect':
          return {
            flex: 1,
            ...column,
            type: 'singleSelect',
            valueOptions: column.valueOptions,
          }
        default:
          return {
            flex: 1,
            ...column,
            renderEditCell: renderEditCellTextField,
            valueGetter: valueGetter,
          }
      }
    })

    setColumns(newHeader)
  }, [header])

  const actions = {
    field: 'actions',
    type: 'actions',
    headerName: '',
    flex: 1,
    cellClassName: 'actions',
    getActions: (params: GridRowParams) => {
      const id = params.id
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            key={id}
            icon={<SaveIcon />}
            label="Save"
            sx={{
              color: 'primary.main',
            }}
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            key={id}
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ]
      }

      const actions = []

      onDelete &&
        actions.push(
          <GridActionsCellItem
            key={id}
            icon={<Delete color="error" />}
            label="Delete"
            onClick={handleDeleteClick(id, params.row)}
            color="inherit"
          />,
        )

      onSaveEdit &&
        actions.push(
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="Edit"
            sx={{
              color: 'primary.main',
            }}
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        )

      return actions
    },
  }

  React.useEffect(() => {
    setRows(dataRows)
  }, [dataRows])

  return (
    <Box width={1}>
      <DataGrid
        sx={{ ...styles.dataGrid, ...sx }}
        rows={rows}
        columns={[...columns, actions]}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        localeText={{
          noRowsLabel: 'Nenhum registro encontrado',
          footerTotalRows: 'Total',
          footerRowSelected: () => null,
        }}
        processRowUpdate={processRowUpdate}
        onPaginationModelChange={(value) => {
          if (!pagination) return
          pagination?.handleParamChange({
            pageNumber: value.page,
            pageSize: value.pageSize,
          })
        }}
        paginationModel={
          pagination && {
            page: pagination.queryParam.pageNumber,
            pageSize: pagination.queryParam.pageSize,
          }
        }
        rowCount={pagination?.totalElements}
        loading={pagination?.isLoading}
        hideFooter={pagination ? false : true}
        isCellEditable={(params) => {
          return params.id !== 'static'
        }}
        density="compact"
        rowHeight={70}
        {...rest}
      />
    </Box>
  )
}

const styles = {
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
    '& .MuiDataGrid-columnHeader': {
      p: '0.5rem 1rem',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      color: 'text.primary',
      fontWeight: 'bold',
    },
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus ': {
      outline: 'none !important',
    },
    // '& .MuiDataGrid-cell': {
    //   display: 'flex',
    //   alignItems: 'center',
    //   py: 0.5,
    // },
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
  },
}
