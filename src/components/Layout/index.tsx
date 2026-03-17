import React from 'react'
import { Layout as AntLayout } from 'antd'
import Header from '../Header'
import Footer from '../Footer'
import styles from './index.module.css'

const { Content } = AntLayout

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout className={styles.layout}>
      <Header />
      <Content className={styles.content}>
        <div className="container">
          {children}
        </div>
      </Content>
      <Footer />
    </AntLayout>
  )
}

export default Layout
