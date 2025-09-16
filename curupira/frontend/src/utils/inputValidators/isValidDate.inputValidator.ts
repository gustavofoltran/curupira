export const isValidDate = (date: string) => {
  const validDate = /^\d{4}-\d{2}-\d{2}$/
  return validDate.test(date)
}
