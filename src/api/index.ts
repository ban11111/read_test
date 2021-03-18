// 放所有 http 请求
import {AxiosInstance} from 'axios'
import {ReqType, wrapSend, Response, createRequest} from "./req";



export class Api {
    request: AxiosInstance  // 普通请求
    down: AxiosInstance     // 下载请求

    constructor(request: ReqType) {
        this.request = request.http
        this.down = request.down
    }

    private download = async <T = any>(url = '', body: any = {}) => {
        const res = await wrapSend<T>(() => {
            return this.request.post<Response>(url, body, {responseType: 'blob'})
        }, 'down')
        return res
    }

    private post = async <T = any>(url = '', body?: any) => {
        const res = await wrapSend<T>(() => {
            return this.request.post<Response>(url, body)
        })
        return res
    }

    // 上传音频文件
    uploadAudio = (payload: any) => {
        return this.post(`/api/upload`, payload)
    }
}

const getAPI = (request: ReqType) => new Api(request)

export default getAPI(createRequest())