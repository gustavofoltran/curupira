import { get } from 'lodash'

export const sortData = <T>(
  data: T[],
  sortHandler: {
    order?: 'asc' | 'desc'
    orderBy?: string
  },
  setSortHandler: React.Dispatch<
    React.SetStateAction<{
      order?: 'asc' | 'desc' | undefined
      orderBy?: string | undefined
    }>
  >,
): { sortedData: T[]; handleSortOnClick: (id: string) => void } => {
  const handleSortOnClick = (id: string) => {
    // Se a mesma coluna for clicada novamente, inverte a ordem
    if (sortHandler.orderBy === id) {
      setSortHandler((prevSortHandler) => ({
        ...prevSortHandler,
        order: prevSortHandler.order === 'asc' ? 'desc' : 'asc',
      }))
    } else {
      // Caso contrário, ordena em ordem ascendente
      setSortHandler({
        order: 'asc',
        orderBy: id,
      })
    }
  }

  // Ordena os dados de acordo com a coluna e a ordem
  const sortedData =
    sortHandler.order && sortHandler.orderBy
      ? data.sort((a, b) => {
          const valueA = get(a, sortHandler.orderBy as string)
          const valueB = get(b, sortHandler.orderBy as string)

          if (valueA < valueB) {
            return sortHandler.order === 'asc' ? -1 : 1
          }
          if (valueA > valueB) {
            return sortHandler.order === 'asc' ? 1 : -1
          }
          return 0
        })
      : data

  return { sortedData, handleSortOnClick }
}
