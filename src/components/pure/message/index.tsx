import React from 'react'
import ReactDOM from 'react-dom'
import Notification from './Notification'
import { Notice, NoticeType } from './config'

interface MessageInstance {
  add: (notice: Notice) => void
  destroy: () => void
}

let Message: MessageInstance

// 生成一个容器 DOM 并返回创建和销毁方法。
function createNotification() {
  // 创建一个div容器，将其插入到body元素中
  const div = document.createElement('div')
  document.body.appendChild(div)
  // 将Notification渲染到div中，返回Notification的实例
  // 若Notification已渲染到div中，那么将对其执行更新，并且对 DOM 只修改需要修改的地方
  const instance = ReactDOM.render(<Notification />, div) as any

  return {
    add(notice: Notice) {
      return instance.addNotice(notice)
    },
    destroy() {
      ReactDOM.unmountComponentAtNode(div)
      document.body.removeChild(div)
    }
  }
}

const notice = (type: NoticeType, text: string, onClose: () => void, duration = 2000) => {
  // 防止生成多个容器
  if (!Message) {
    Message = createNotification()
  }
  if (!text) {
    return
  } else {
    text = text.toString()
    // 添加一个消息
    return Message.add({
      type,
      text,
      onClose,
      duration
    })
  }
}

export default {
  info: (text: string, onClose?: () => void, duration?: number) => notice('info', text, onClose!, duration),
  success: (text: string, onClose?: () => void, duration?: number) => notice('success', text, onClose!, duration),
  error: (text: string, onClose?: () => void, duration?: number) => notice('error', text, onClose!, duration),
  warning: (text: string, onClose?: () => void, duration?: number) => notice('warning', text, onClose!, duration),
  hide: () => {
    if (Message) {
      return Message.destroy()
    }
  }
}
