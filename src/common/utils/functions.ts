export const createSlug = (str: string) => {
  return str?.replace(/[-_@#$%^&*'";:`\+\.،يًٌٍْ]+/g, '')?.replace(/[\s]+/g, '-')
}

export const randomId = () => {
  return Math.random().toString(36).substring(2)
}