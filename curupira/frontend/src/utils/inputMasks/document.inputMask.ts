export const documentInputMask = (document: string): string => {
  return document.length === 11 ? '999.999.999-99' : '99.999.999/9999-99'
}
