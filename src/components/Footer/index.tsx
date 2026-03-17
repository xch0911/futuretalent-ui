import React from 'react'
import { Layout } from 'antd'
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
          </div>
          <div className={styles.links}>
            <div className={styles.column}>
              <div className={styles.columnTitle}>产品</div>
              <a href="#">关于我们</a>
              <a href="#">使用指南</a>
              <a href="#">常见问题</a>
            </div>
            <div className={styles.column}>
              <div className={styles.columnTitle}>联系我们</div>
              <a href="#">反馈建议</a>
              <a href="#">加入我们</a>
              <a href="#">商务合作</a>
            </div>
            <div className={styles.column}>
              <div className={styles.columnTitle}>法律</div>
              <a href="#">用户协议</a>
              <a href="#">隐私政策</a>
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
