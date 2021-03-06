import axios, { AxiosInstance, AxiosPromise } from 'axios'

export interface ReqType {
  http: AxiosInstance
  down: AxiosInstance
}

export interface Response {
  success: boolean
  info?: string
  data: any
  headers: any
  status: number
}

export interface Res<T> {
  success: boolean
  info?: string
  data?: T
  headers?: any
}

type requestFun = () => AxiosPromise<Response>

export const createRequest = (): ReqType => {
  const common = {
    baseURL: '',
    headers: {
      'Content-Type': 'application/json',
      Token: sessionStorage.getItem('token')
    }
  }
  return {
    http: axios.create(common),
    down: axios.create({ ...common, responseType: 'blob' })
  }
}

export const wrapSend = async <T>(requestFunc: requestFun, type?: string): Promise<Res<T>> => {
  let response
  try {
    const res = await requestFunc()
    const { data, headers } = res
    response = {
      success: type ? res.status === 200 : data.success,
      info: data.info,
      data: type ? data : data.data,
      headers: headers
    }
  } catch (err) {
    const { data } = err.response
    if (err.response.status === 403) {
      setTimeout(() => {
        sessionStorage.clear()
        window.location.replace('/admin/login')
      }, 2000)
      return {
        info: 'Your login information is invalid, please login again!',
        success: false
      }
    }
    if (err.response.status === 400) {
      return {
        success: data.success,
        info: data.info,
        data: data
      }
    }
    response = {
      success: data.success,
      info: err.response.status + ' ' + err.response.statusText,
      data: data
    }
  }
  return response
}
