import axios, { AxiosInstance, AxiosPromise } from 'axios'

export interface ReqType {
  http: AxiosInstance
  down: AxiosInstance
}

export interface Response {
  success: boolean
  msg?: string
  data: any
}

export interface Res<T> {
  success: boolean
  info: string
  data?: T
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
  // 设置请求拦截，在请求头中添加产品名称
  const instance = axios.create(common)
  return {
    http: instance,
    down: axios.create({ ...common, responseType: 'blob' })
  }
}

export const wrapSend = async <T>(requestFunc: requestFun, type?: string): Promise<Res<T>> => {
  let response
  try {
    const res = await requestFunc()
    const { data } = res
    response = {
      success: type ? true : data.success,
      info: data.msg,
      data: type ? data : data.data
    }
  } catch (err) {
    const { data } = err.response
    if (err.response.status === 403) {
      setTimeout(() => {
        sessionStorage.clear()
        window.location.replace('/login')
      }, 2000)
      return {
        info: 'Your login information is invalid, please login again!',
        success: false
      }
    }
    response = {
      success: data.success,
      info: data.err_msg,
      data: data
    }
  }
  return response
}
