import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {
  AccordionSummary,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  alpha,
  styled,
  useTheme,
} from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { grey } from '@mui/material/colors'
import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import modules from '~/routes/data/modules.data'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

type TProps = {
  open: boolean
  setOpen: (value: boolean) => void
  expanded: string | false
  setExpanded: (value: string | false) => void
}
export const Sidebar = ({ open, setOpen, expanded, setExpanded }: TProps) => {
  const location = useLocation()
  const theme = useTheme()

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  return (
    <>
      <Divider />
      <List
        sx={{
          px: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {modules?.map((module, index) => {
          const moduleExpaded = expanded === module.title
          const isSelected =
            location.pathname.includes(module.path) || expanded === module.title
          return (
            <Accordion
              key={index}
              disableGutters
              elevation={0}
              expanded={moduleExpaded}
              onChange={handleChange(module.title)}
              sx={{
                border: 0,
              }}
            >
              <AccordionSummary
                expandIcon={open ? <ArrowDropDownIcon /> : undefined}
                sx={{
                  backgroundColor: isSelected
                    ? alpha(theme.palette.primary.main, 0.1)
                    : '',
                  ':hover': {
                    backgroundColor: isSelected
                      ? alpha(theme.palette.primary.main, 0.1)
                      : grey[100],
                  },
                  borderRadius: 2,
                  justifyContent: open ? 'initial' : 'center',
                  '& .MuiAccordionSummary-content': {
                    my: 0,
                    alignItems: 'center',
                    gap: 1,
                  },
                }}
                onClick={() => {
                  if (!open) setOpen(true)
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: 'center',
                    color: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                  }}
                >
                  {module.icon}
                </ListItemIcon>
                <ListItemText
                  primary={module.title}
                  sx={{
                    display: open ? 'block' : 'none',

                    color: isSelected ? theme.palette.primary.main : 'inherit',
                  }}
                />
              </AccordionSummary>
              <AccordionDetails
                sx={{ p: 0, py: 1, border: 0, position: 'relative' }}
              >
                <Box
                  sx={{
                    width: 4,
                    borderRadius: 1,
                    background: grey[300],
                    height: 1,
                    position: 'absolute',
                    ml: 3.3,
                  }}
                ></Box>
                <List sx={{ ml: 5 }}>
                  {module.submodules
                    .filter((value) => value.showSidebar)
                    .map((submodule, index) => {
                      const isSelected =
                        location.pathname === module.path + submodule.path

                      return (
                        <ListItem key={index} disablePadding>
                          <ListItemButton
                            component={Link}
                            to={module.path + submodule.path}
                            onClick={() => {
                              // setOpen(false)
                              // setExpanded(false)
                            }}
                            sx={{
                              borderRadius: 2,
                              backgroundColor: isSelected
                                ? alpha(theme.palette.primary.main, 0.1)
                                : 'transparent',
                              '& .MuiTypography-root': {
                                color: isSelected
                                  ? theme.palette.primary.main
                                  : 'inherit',
                              },
                              ':hover': {
                                backgroundColor: isSelected
                                  ? alpha(theme.palette.primary.main, 0.1)
                                  : grey[100],
                              },
                            }}
                          >
                            <ListItemText primary={submodule.title} />
                          </ListItemButton>
                        </ListItem>
                      )
                    })}
                </List>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </List>
    </>
  )
}
