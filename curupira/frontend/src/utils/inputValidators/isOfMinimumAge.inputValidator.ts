export const isOfMinimumAge = (minAge: number, value?: string | Date) => {
  if (!value) return false
  const birthdate = new Date(value)
  const today = new Date()
  const age = today.getFullYear() - birthdate.getFullYear()
  const m = today.getMonth() - birthdate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    return age - 1 >= minAge
  }
  return age >= minAge
}
