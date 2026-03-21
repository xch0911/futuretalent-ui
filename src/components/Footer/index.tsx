import React from 'react'
import { Layout } from 'antd'
import { GithubOutlined, WechatOutlined, WeiboOutlined, MailOutlined } from '@ant-design/icons'
import styles from './index.module.css'

const { Footer: AntFooter } = Layout

const Footer: React.FC = () => {
  return (
    <AntFooter className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.title}>未来人才网</div>
            <div className={styles.description}>
              连接想法，成就未来。让每个人才都能发光发热。
            </div>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} title="GitHub">
                <GithubOutlined />
              </a>
              <a href="#" className={styles.socialLink} title="微信">
                <WechatOutlined />
              </a>
              <a href="#" className={styles.socialLink} title="微博">
                <WeiboOutlined />
              </a>
              <a href="mailto:contact@futuretalent.com" className={styles.socialLink} title="邮箱">
                <MailOutlined />
              </a>
            </div>
          </div>
          <div className={styles.links}>
            <div className={styles.column}>
              <div className={styles.columnTitle}>产品</div>
              <a href="/about">关于我们</a>
              <a href="/faq">常见问题</a>
            </div>
            <div className={styles.column}>
              <div className={styles.columnTitle}>联系</div>
              <a href="/feedback">反馈建议</a>
            </div>
            <div className={styles.column}>
              <div className={styles.columnTitle}>法律</div>
              <a href="/terms">用户协议</a>
              <a href="/privacy">隐私政策</a>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} FutureTalent. All rights reserved.
        </div>
      </div>
    </AntFooter>
  )
}

export default Footer
