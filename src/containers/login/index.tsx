import React, { useState } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import * as utils from './utils'

const Login: React.FC<any> = (props: any) => {
  const [obj, changeObj] = useState({ name: '', isCheck: false })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }
  const handleChange = (e: any) => {
    changeObj({ ...obj, isCheck: e.target.checked })
    props.form.validateFields(['nickname'], { force: true })
  }

  const { getFieldDecorator } = props.form
  return (
    <div>
      <div>
        <Form.Item {...utils.formItemLayout} label="Name">
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: 'Please input your name'
              }
            ]
          })(<Input placeholder="Please input your name" />)}
        </Form.Item>
        <Form.Item {...utils.formItemLayout} label="Nickname">
          {getFieldDecorator('nickname', {
            rules: [
              {
                required: true,
                message: 'Please input your nickname'
              }
            ]
          })(<Input placeholder="Please input your nickname" />)}
        </Form.Item>
        <Form.Item {...utils.formTailLayout}>
          <Checkbox checked={obj.isCheck} onChange={handleChange}>
            Nickname is required
          </Checkbox>
        </Form.Item>
        <Form.Item {...utils.formTailLayout}>
          <Button type="primary" onClick={handleSubmit}>
            Check
          </Button>
        </Form.Item>
      </div>
    </div>
  )
}

export default Form.create({ name: 'normal_login' })(Login)
