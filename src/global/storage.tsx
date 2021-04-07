export const KeyUserInfo = 'user_info'
export const KeyAdminToken = 'token'

export const storageSet = (key: string, obj: object) => {
  sessionStorage.setItem(key, JSON.stringify(obj))
}

export const storageGet = (key: string): object | null => {
  const flattenedObj = sessionStorage.getItem(key)
  if (!flattenedObj) {
    return null
  }
  return JSON.parse(flattenedObj)
}
