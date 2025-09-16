export function limitCaracters(text: string, limit: number) {
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}
