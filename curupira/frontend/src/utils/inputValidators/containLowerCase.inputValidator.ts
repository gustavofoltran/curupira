export const containLowerCase = (value?: string): boolean =>
  !!value && /^.*(?=.*[a-z]).*$/.test(value)
