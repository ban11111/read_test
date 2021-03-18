import React, { Component } from 'react'
import { Notice } from './config'
import styles from './index.module.scss'

interface State {
  notices: Notice[]
}

class Notification extends Component<Record<string, any>, State> {
  transitionTime: number

  constructor(props: Record<string, any>) {
    super(props)
    //设置回调函数的执行
    this.transitionTime = 300
    this.state = {
      notices: []
    }
  }

  // 使用时间和数组长度以保证唯一性
  getNoticeKey = () => {
    return `notice:${new Date().getTime()}:${this.state.notices.length}`
  }

  addNotice = (notice: Notice) => {
    // 创造一个不重复的key
    const { notices } = this.state
    const key = notice.key ? notice.key : (notice.key = this.getNoticeKey())
    const temp = notices.filter((item: Notice) => item.key === key).length

    if (!temp) {
      // 不存在重复的 添加
      notices.push(notice)
      // notices[0] = notice
      this.setState({
        notices
      })
    }

    if (notice.duration > 0) {
      setTimeout(() => {
        this.removeNotice(notice.key!)
      }, notice.duration)
    }
  }

  removeNotice = (key: string) => {
    let { notices } = this.state
    notices = notices.filter((item: Notice) => {
      if (item.key === key) {
        if (item.onClose) {
          setTimeout(item.onClose, this.transitionTime)
        }
        return false
      }
      return true
    })
    this.setState({
      notices
    })
  }

  render() {
    const { notices } = this.state
    return (
      // 当长度为0时不渲染容器
      notices.length ? (
        <div className={styles.wrap}>
          {notices.map((item: Notice) => (
            <div className={[styles.inner, styles[`${item.type}`]].join(' ')} key={item.key}>
              <i className={styles[`${item.type}`]} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      ) : (
        ''
      )
    )
  }
}

export default Notification
