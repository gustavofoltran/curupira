export const containSpecialCharacter = (value?: string): boolean =>
  !!value && /^.*(?=.*[!@#$%^&*_])([a-zA-Z0-9!@#$%^&*_]+).*$/.test(value)
