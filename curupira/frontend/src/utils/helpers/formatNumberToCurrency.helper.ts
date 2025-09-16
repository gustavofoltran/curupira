export const formatNumberToCurrency = (value?: number) => {
  if (!value) return ''

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return formatter.format(value)
}
