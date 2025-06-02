// Check if a value is null or undefined
export const isNullOrUndefined = (
  value: unknown
): value is null | undefined => {
  return value === null || value === undefined
}

// Check if a value is empty (null, undefined, empty string, empty array, empty object)
export const isEmpty = (
  value: string | number | boolean | object | null | undefined | unknown[]
): boolean => {
  if (isNullOrUndefined(value)) return true

  if (typeof value === 'string') return value.trim() === ''

  if (Array.isArray(value)) return value.length === 0

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false
}

// Check if a string is numeric
export const isNumeric = (value: string): boolean => {
  if (isEmpty(value)) return false

  return !isNaN(Number(value)) && !isNaN(parseFloat(value))
}

// Check if a URL is valid
export const isValidUrl = (url: string): boolean => {
  if (isEmpty(url)) return false
  try {
    new URL(url)

    return true
  } catch {
    return false
  }
}

// Check if a string is in valid JSON format
export const isValidJSON = (str: string): boolean => {
  if (isEmpty(str)) return false
  try {
    JSON.parse(str)

    return true
  } catch {
    return false
  }
}

// Check if an array contains a specific value
export const arrayContains = <T>(array: T[], value: T): boolean => {
  if (!Array.isArray(array) || isEmpty(array)) return false

  return array.includes(value)
}

// Check if an object has a specific key
export const hasProperty = (obj: object, key: string): boolean => {
  if (isNullOrUndefined(obj) || typeof obj !== 'object') return false

  return Object.prototype.hasOwnProperty.call(obj, key)
}
