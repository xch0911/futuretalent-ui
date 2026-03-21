import React from 'react'
import { Card, Row, Col } from 'antd'
import styles from './index.module.css'

const About: React.FC = () => {
  return (
    <div className={styles.about}>
      <div className="container">
      <Card className={styles.hero}>
        <h1 className={styles.title}>关于未来人才网</h1>
        <p className={styles.subtitle}>连接想法，成就未来</p>
      </Card>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} md={12}>
            <Card title="我们的使命" className={styles.card}>
              <p>
                未来人才网是一个让年轻人分享想法、展示才华、连接机会的平台。
                在这里，每个想法都值得被看见，每个才华都能找到舞台。
              </p>
              <p>
                我们相信，未来的创新来自于年轻人的奇思妙想。
                无论是科技创新、艺术创作，还是社会创新，
                都需要一个自由表达、交流碰撞的空间。
              </p>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="我们的愿景" className={styles.card}>
              <p>
                成为年轻人首选的创意分享平台，
                让每一个有想法的人都能找到志同道合的伙伴。
              </p>
              <p>
                我们期待看到：
              </p>
              <ul className={styles.list}>
                <li>科技创新者找到投资人</li>
                <li>艺术家找到欣赏者</li>
                <li>创业者找到合作伙伴</li>
                <li>每个人都能实现自己的价值</li>
              </ul>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} md={8}>
            <Card title="分享想法" className={styles.featureCard}>
              <p>
                发布你的创意、项目、思考，
                让更多人看到你的想法。
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="连接人才" className={styles.featureCard}>
              <p>
                发现志同道合的伙伴，
                建立有价值的连接。
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="成就未来" className={styles.featureCard}>
              <p>
                让想法变成现实，
                让才华得到施展。
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default About
