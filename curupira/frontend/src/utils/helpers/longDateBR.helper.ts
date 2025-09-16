export const longDateBR = () => {
  const date = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const dateSplit = date.split(' ')
  const monthCapitalized =
    dateSplit[2].charAt(0).toUpperCase() + dateSplit[2].slice(1)
  return `${dateSplit[0]} de ${monthCapitalized} de ${dateSplit[4]}`
}
