// 放所有 http 请求
import { AxiosInstance } from 'axios'
import { createRequest, ReqType, Response, wrapSend } from './req'

export class Api {
  request: AxiosInstance // 普通请求
  down: AxiosInstance // 下载请求

  constructor(request: ReqType) {
    this.request = request.http
    this.down = request.down
  }

  private download = async <T = any>(url = '', body: any = {}) => {
    return await wrapSend<T>(() => {
      return this.request.post<Response>(url, body, { responseType: 'blob' })
    }, 'down')
  }

  private post = async <T = any>(url = '', body?: any) => {
    return await wrapSend<T>(() => {
      return this.request.post<Response>(url, body)
    })
  }

  // 用户注册
  signUp = (payload: any) => {
    return this.post(`/api/v1/sign_up`, payload)
  }

  // 用户登录
  signIn = (payload: any) => {
    return this.post(`/api/v1/sign_in`, payload)
  }

  // 获取做题基本信息
  getBasicInfo = (payload: any) => {
    return this.post(`/api/v1/get_basic_info`, payload)
  }

  // 上传音频文件
  uploadAudio = (payload: any) => {
    return this.post(`/api/v1/upload`, payload)
  }

  // =====  admin  =====
  adminLogin = (payload: any) => {
    return this.post(`/api/v1/admin/login`, payload)
  }

  queryPapers = () => {
    return this.post(`/api/v1/admin/query_papers`)
  }

  addPaper = (payload: any) => {
    return this.post(`/api/v1/admin/add_paper`, payload)
  }

  editPaper = (payload: any) => {
    return this.post(`/api/v1/admin/edit_paper`, payload)
  }

  QueryUsers = () => {
    return this.post(`/api/v1/admin/query_users`)
  }

  QueryAnswers = (payload: any) => {
    return this.post(`/api/v1/admin/query_answers`, payload)
  }

  querySettings = () => {
    return this.post(`/api/v1/admin/query_settings`)
  }

  updateSetting = (payload: any) => {
    return this.post(`/api/v1/admin/update_setting`, payload)
  }
}

const getAPI = (request: ReqType) => new Api(request)

export default getAPI(createRequest())
