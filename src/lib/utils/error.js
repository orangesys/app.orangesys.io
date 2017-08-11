// @flow

class CustomError extends Error {
  code: string
}

export const generateError = (message: string, code: string) => {
  const e = new CustomError(message)
  e.code = code
  return e
}
