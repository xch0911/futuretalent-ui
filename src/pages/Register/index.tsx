import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import styles from './index.module.css'
import { register } from '@/services/auth'

interface RegisterForm {
  nickname: string
  email: string
  password: string
  confirmPassword: string
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async (values: RegisterForm) => {
    try {
      setLoading(true)
      await register({
        nickname: values.nickname,
        email: values.email,
        password: values.password,
      })
      message.success('注册成功，请登录')
      navigate('/login')
    } catch (error) {
      console.error('注册失败', error)
      message.error('注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card title="注册未来人才网" className={styles.card}>
        <Form
          form={form}
          onFinish={onFinish}
          size="large"
          autoComplete="on"
        >
          <Form.Item
            name="nickname"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="昵称"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱地址"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少 6 位' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码（至少 6 位）"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
          </Form.Item>

          <div className={styles.footer}>
            已有账号？<Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register
