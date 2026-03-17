import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="页面不存在"
      subTitle="抱歉，你访问的页面不存在或已经被删除"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  )
}

export default NotFound
