import * as Yup from 'yup'

Yup.setLocale({
  mixed: {
    default: 'Inválido.',
    required: 'Obrigatório.',
    oneOf: 'Deve ter um dos seguintes valores: ${values}.',
    notOneOf: 'Não deve ter nenhum dos seguintes valores: ${values}.',
    defined: 'Obrigatório.',
    notType: 'Obrigatório.',
  },
  string: {
    length: ({ length }: any) =>
      `Deve ter ${length} ${length === 1 ? 'caractere' : 'caracteres'}.`,
    min: ({ min }: any) =>
      `Deve ter pelo menos ${min} ${min === 1 ? 'caractere' : 'caracteres'}.`,
    max: ({ max }: any) =>
      `Deve ter no máximo ${max} ${max === 1 ? 'caractere' : 'caracteres'}.`,
    matches: 'Deve corresponder ao padrão: "${regex}".',
    email: 'Deve ser um e-mail válido.',
    url: 'Deve ser uma URL válida.',
    trim: 'Não deve conter espaços adicionais no início nem no fim.',
    lowercase: 'Deve estar em letras minúsculas.',
    uppercase: 'Deve estar em letras maiúsculas.',
  },
  number: {
    min: 'Deve ser maior ou igual a ${min}.',
    max: 'Deve menor ou igual a ${max}.',
    lessThan: 'Deve ser menor que ${less}.',
    moreThan: 'Deve ser maior que ${more}.',
    positive: 'Deve ser um número positivo.',
    negative: 'Deve ser um número negativo.',
    integer: 'Deve ser um número inteiro.',
  },
  date: {
    min: 'Deve ser posterior a ${min}.',
    max: 'Deve ser anterior a ${max}.',
  },
})

export { Yup }
