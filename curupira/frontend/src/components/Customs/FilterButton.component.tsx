import { FilterList } from '@mui/icons-material'
import { Button, ButtonProps } from '@mui/material'

type TProps = ButtonProps & {
  children: React.ReactNode
}
export const FilterButton = ({ children, ...rest }: TProps) => {
  return (
    <Button variant="outlined" startIcon={<FilterList />} sx={{ ml: 'auto' }} {...rest}>
      {children}
    </Button>
  )
}
