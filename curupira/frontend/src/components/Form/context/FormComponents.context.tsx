import { createContext, ReactNode, useContext } from 'react'

const FormComponentsContext = createContext(true)

const FormComponentsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FormComponentsContext.Provider value={true}>
      {children}
    </FormComponentsContext.Provider>
  )
}

const useFormComponents = () => {
  const context = useContext(FormComponentsContext)

  if (context === null) {
    throw new Error('FormComponents can only be used inside a Form.')
  }

  return context
}

export { FormComponentsProvider, useFormComponents }
