import { useState } from 'react'

interface IPaginationAndFilters {
  pageSize: number
  pageNumber: number
  [key: string]: any // Para permitir outros filtros opcionais
}

export const usePaginationAndFilters = <T extends IPaginationAndFilters>(
  initialParams: T,
) => {
  const [params, setParams] = useState<T>(initialParams)

  const handleParamChange = (newParams: Partial<T>) => {
    const withoutEmptyValues = Object.fromEntries(
      Object.entries({ ...params, ...newParams }).filter(
        ([_, v]) => ![null, undefined, ''].includes(v),
      ),
    )

    setParams(withoutEmptyValues as T)
  }

  const handlePageChange = (_e: unknown, newPage: number) =>
    handleParamChange({ pageNumber: newPage } as Partial<T>)

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleParamChange({
      pageSize: +e.target.value,
      pageNumber: 1,
    } as Partial<T>)

  return {
    params,
    handleParamChange,
    handlePageChange,
    handleRowsPerPageChange,
  }
}
