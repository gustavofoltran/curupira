export const containUpperCase = (value?: string): boolean =>
  !!value && /^.*(?=.*[A-Z]).*$/.test(value)
