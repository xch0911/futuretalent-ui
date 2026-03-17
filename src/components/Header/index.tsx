import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Input, Button, Avatar, Dropdown, Space, MenuProps } from 'antd'
import { SearchOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './index.module.css'

const { Header: AntHeader } = Layout

const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  const isLoggedIn = false // TODO: 从状态管理获取登录状态
  const userInfo = null // TODO: 从状态管理获取用户信息

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人主页',
      onClick: () => navigate(`/user/${userInfo?.id}`),
    },
    {
      key: 'my-ideas',
      label: '我的想法',
      onClick: () => navigate('/ideas'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      onClick: () => {
        // TODO: 处理退出登录
        navigate('/')
      },
    },
  ]

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/ideas?q=${encodeURIComponent(searchText.trim())}`)
    }
  }

  return (
    <AntHeader className={styles.header}>
      <div className="container">
        <div className={styles.content}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>未来人才网</span>
          </Link>

          <nav className={styles.nav}>
            <Link 
              to="/" 
              className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
            >
              首页
            </Link>
            <Link 
              to="/ideas" 
              className={`${styles.navLink} ${location.pathname.startsWith('/ideas') ? styles.active : ''}`}
            >
              想法广场
            </Link>
          </nav>

          <div className={styles.search}>
            <Input
              placeholder="搜索想法、用户..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.actions}>
            {isLoggedIn ? (
              <>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/idea/create')}
                >
                  发布想法
                </Button>
                <Dropdown menu={{ items }} placement="bottomRight">
                  <Avatar 
                    size="small"
                    src={userInfo?.avatar}
                    icon={<UserOutlined />}
                    className={styles.avatar}
                    style={{ cursor: 'pointer' }}
                  />
                </Dropdown>
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/login')}>登录</Button>
                <Button type="primary" onClick={() => navigate('/register')} style={{ marginLeft: 8 }}>
                  注册
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </AntHeader>
  )
}

export default Header
