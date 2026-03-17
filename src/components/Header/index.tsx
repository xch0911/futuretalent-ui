import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Input, Button, Avatar, Dropdown, MenuProps, Drawer } from 'antd'
import { SearchOutlined, UserOutlined, PlusOutlined, MenuOutlined } from '@ant-design/icons'
import { User } from '@/types'
import styles from './index.module.css'

const { Header: AntHeader } = Layout

const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const isLoggedIn = false // TODO: 从状态管理获取登录状态
  const userInfo: User | null = null // TODO: 从状态管理获取用户信息

  // 帮助 TypeScript 推断类型
  const user = userInfo as User | null

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人主页',
      onClick: () => user && navigate(`/user/${user.id}`),
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
            {/* 移动端汉堡菜单按钮 */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              className={styles.menuButton}
              onClick={() => setMenuOpen(true)}
            />

            {/* 桌面端正常显示 */}
            <div className={styles.desktopActions}>
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
                      src={user ? user.avatar : undefined}
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
      </div>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="菜单"
        placement="right"
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        width={240}
      >
        <div className={styles.mobileMenu}>
          <Link 
            to="/" 
            className={styles.mobileNavLink}
            onClick={() => setMenuOpen(false)}
          >
            首页
          </Link>
          <Link 
            to="/ideas" 
            className={styles.mobileNavLink}
            onClick={() => setMenuOpen(false)}
          >
            想法广场
          </Link>
          <div className={styles.mobileSearch}>
            <Input
              placeholder="搜索..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => {
                handleSearch()
                setMenuOpen(false)
              }}
            />
          </div>
          {isLoggedIn ? (
            <>
              <Button 
                type="primary" 
                block
                icon={<PlusOutlined />}
                style={{ marginTop: 16 }}
                onClick={() => {
                  navigate('/idea/create')
                  setMenuOpen(false)
                }}
              >
                发布想法
              </Button>
            </>
          ) : (
            <>
              <Button 
                block 
                style={{ marginTop: 16 }}
                onClick={() => {
                  navigate('/login')
                  setMenuOpen(false)
                }}
              >
                登录
              </Button>
              <Button 
                type="primary" 
                block
                style={{ marginTop: 8 }}
                onClick={() => {
                  navigate('/register')
                  setMenuOpen(false)
                }}
              >
                注册
              </Button>
            </>
          )}
        </div>
      </Drawer>
    </AntHeader>
  )
}

export default Header
