class CustomError extends Error {
  code: string

  constructor(code: string) {
    super()
    this.code = code
  }
}

export const generateError = (message: string, code: string) => {
  const e = new CustomError(message)
  e.code = code
  return e
}
