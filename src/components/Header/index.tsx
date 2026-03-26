import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Input, Button, Avatar, Dropdown, MenuProps, Drawer, message, Divider } from 'antd'
import { SearchOutlined, UserOutlined, PlusOutlined, MenuOutlined, GithubOutlined, WechatOutlined, WeiboOutlined, MailOutlined } from '@ant-design/icons'
import { User } from '@/types'
import styles from './index.module.css'

const { Header: AntHeader } = Layout

const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // 从 localStorage 加载用户信息
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
        setIsLoggedIn(true)
      } catch (e) {
        console.error('解析用户信息失败', e)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        setUser(null)
      }
    }
  }, [])

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    message.success('已退出登录')
    // 强制刷新页面，让所有组件重新加载登录状态
    window.location.href = '/'
  }

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人主页',
      onClick: () => {
        if (user?.id) {
          navigate(`/user/${user.id}`)
        } else {
          message.warning('请先登录')
          navigate('/login')
        }
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      onClick: handleLogout,
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
              to="/recommend" 
              className={`${styles.navLink} ${location.pathname === '/recommend' || location.pathname === '/' ? styles.active : ''}`}
            >
              推荐
            </Link>
            <Link 
              to="/hot" 
              className={`${styles.navLink} ${location.pathname === '/hot' ? styles.active : ''}`}
            >
              热门
            </Link>
            <Link 
              to="/ideas" 
              className={`${styles.navLink} ${location.pathname === '/ideas' ? styles.active : ''}`}
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
        width={280}
      >
        <div className={styles.mobileMenu}>
          {/* 用户信息区 + 功能区（合并） */}
          {isLoggedIn && user ? (
            <div className={styles.mobileUserSection}>
              <div 
                className={styles.mobileUserInfo}
                onClick={() => {
                  if (user?.id) {
                    navigate(`/user/${user.id}`)
                  }
                  setMenuOpen(false)
                }}
              >
                <Avatar size={48} src={user.avatar} icon={<UserOutlined />} />
                <div className={styles.mobileUserName}>{user.nickname}</div>
              </div>
              <Button 
                type="primary" 
                block
                style={{ marginTop: 16 }}
                onClick={() => {
                  navigate('/idea/create')
                  setMenuOpen(false)
                }}
              >
                ✍️ 发布想法
              </Button>
              <Button 
                block
                style={{ marginTop: 8 }}
                onClick={() => {
                  handleLogout()
                  setMenuOpen(false)
                }}
              >
                🚪 退出登录
              </Button>
            </div>
          ) : (
            <div className={styles.mobileUserSection}>
              <Button 
                block 
                onClick={() => {
                  navigate('/login')
                  setMenuOpen(false)
                }}
              >
                🔐 登录
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
                ✨ 注册账号
              </Button>
            </div>
          )}

          <Divider style={{ margin: '16px 0' }} />

          {/* 主菜单 - 导航 */}
          <div className={styles.mobileNavSection}>
            <div className={styles.mobileSectionTitle}>导航</div>
            <Link 
              to="/recommend" 
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              🎲 推荐
            </Link>
            <Link 
              to="/hot" 
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              🔥 热门
            </Link>
            <Link 
              to="/ideas" 
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              💡 想法广场
            </Link>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* 搜索 */}
          <div className={styles.mobileSearch}>
            <div className={styles.mobileSectionTitle}>搜索</div>
            <Input
              placeholder="搜索想法、用户..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => {
                handleSearch()
                setMenuOpen(false)
              }}
            />
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Footer 链接 - 与页脚一致 */}
          <div className={styles.mobileFooterLinks}>
            <div className={styles.mobileSectionTitle}>产品</div>
            <a href="/about" className={styles.mobileFooterLink}>关于我们</a>
            <a href="/faq" className={styles.mobileFooterLink}>常见问题</a>
            
            <div className={styles.mobileSectionTitle} style={{ marginTop: 16 }}>联系</div>
            <a href="/feedback" className={styles.mobileFooterLink}>反馈建议</a>
            
            <div className={styles.mobileSectionTitle} style={{ marginTop: 16 }}>法律</div>
            <a href="/terms" className={styles.mobileFooterLink}>用户协议</a>
            <a href="/privacy" className={styles.mobileFooterLink}>隐私政策</a>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* 社交图标 */}
          <div className={styles.mobileSocial}>
            <a href="#" className={styles.mobileSocialLink} title="GitHub">
              <GithubOutlined />
            </a>
            <a href="#" className={styles.mobileSocialLink} title="微信">
              <WechatOutlined />
            </a>
            <a href="#" className={styles.mobileSocialLink} title="微博">
              <WeiboOutlined />
            </a>
            <a href="mailto:contact@futuretalent.com" className={styles.mobileSocialLink} title="邮箱">
              <MailOutlined />
            </a>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* 版权信息 */}
          <div className={styles.mobileCopyright}>
            © {new Date().getFullYear()} FutureTalent
          </div>
        </div>
      </Drawer>
    </AntHeader>
  )
}

export default Header
