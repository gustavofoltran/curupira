export const containNumber = (value?: string): boolean =>
  !!value && /^.*(?=.*[0-9]).*$/.test(value)
