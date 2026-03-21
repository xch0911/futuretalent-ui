import React from 'react'
import { Card, Typography } from 'antd'
import styles from './index.module.css'

const { Title, Paragraph } = Typography

const Privacy: React.FC = () => {
  return (
    <div className={styles.privacy}>
      <div className="container">
      <Card className={styles.hero}>
          <h1 className={styles.title}>隐私政策</h1>
          <p className={styles.subtitle}>我们如何保护您的个人信息</p>
          <p className={styles.updateTime}>最后更新：2026 年 3 月 19 日</p>
        </Card>

        <Card className={styles.content}>
          <Title level={3}>一、信息收集</Title>
          <Paragraph>
            1.1 我们收集的信息包括：
          </Paragraph>
          <Paragraph className={styles.list}>
            • 账号信息：昵称、邮箱、头像<br/>
            • 发布内容：想法、评论、点赞<br/>
            • 使用数据：浏览记录、操作日志<br/>
            • 设备信息：IP 地址、浏览器类型
          </Paragraph>
          <Paragraph>
            1.2 我们不会收集您的敏感个人信息，如身份证号、银行卡号等。
          </Paragraph>

          <Title level={3}>二、信息使用</Title>
          <Paragraph>
            2.1 我们使用收集的信息用于：
          </Paragraph>
          <Paragraph className={styles.list}>
            （一）提供和改进我们的服务；<br/>
            （二）向您推荐可能感兴趣的内容；<br/>
            （三）保护平台和用户安全；<br/>
            （四）遵守法律法规要求。
          </Paragraph>

          <Title level={3}>三、信息共享</Title>
          <Paragraph>
            3.1 我们不会向第三方出售、出租或交易您的个人信息。
          </Paragraph>
          <Paragraph>
            3.2 在以下情况下，我们可能会共享您的信息：
          </Paragraph>
          <Paragraph className={styles.list}>
            （一）获得您的明确同意；<br/>
            （二）法律法规要求；<br/>
            （三）保护平台和用户安全所必需。
          </Paragraph>

          <Title level={3}>四、信息保护</Title>
          <Paragraph>
            4.1 我们采取技术措施保护您的信息安全，包括：
          </Paragraph>
          <Paragraph className={styles.list}>
            • 数据加密传输<br/>
            • 访问权限控制<br/>
            • 安全审计日志<br/>
            • 定期安全评估
          </Paragraph>
          <Paragraph>
            4.2 我们会定期更新安全措施，但无法保证绝对安全。
          </Paragraph>

          <Title level={3}>五、您的权利</Title>
          <Paragraph>
            5.1 您有权访问、更正、删除您的个人信息。
          </Paragraph>
          <Paragraph>
            5.2 您可以通过以下方式行使权利：
          </Paragraph>
          <Paragraph className={styles.list}>
            （一）在个人主页修改昵称、简介；<br/>
            （二）删除自己发布的内容；<br/>
            （三）注销账号；<br/>
            （四）通过反馈建议联系我们。
          </Paragraph>

          <Title level={3}>六、Cookie 使用</Title>
          <Paragraph>
            6.1 我们使用 Cookie 来提升用户体验，包括：
          </Paragraph>
          <Paragraph className={styles.list}>
            • 保持登录状态<br/>
            • 记录偏好设置<br/>
            • 分析使用情况
          </Paragraph>
          <Paragraph>
            6.2 您可以通过浏览器设置管理或禁用 Cookie。
          </Paragraph>

          <Title level={3}>七、未成年人保护</Title>
          <Paragraph>
            7.1 我们鼓励家长或监护人指导未成年人使用本平台。
          </Paragraph>
          <Paragraph>
            7.2 如未成年人提供了个人信息，请家长或监护人及时联系我们。
          </Paragraph>

          <Title level={3}>八、政策更新</Title>
          <Paragraph>
            8.1 我们可能会更新本隐私政策，更新后的政策将在本平台公布。
          </Paragraph>
          <Paragraph>
            8.2 重大变更时，我们会通过站内通知等方式告知您。
          </Paragraph>

          <Title level={3}>九、联系我们</Title>
          <Paragraph>
            9.1 如对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
          </Paragraph>
          <Paragraph className={styles.list}>
            • 反馈建议页面<br/>
            • 邮箱：xch0911@gmail.com
          </Paragraph>
          <Paragraph>
            9.2 我们将在 15 个工作日内回复。
          </Paragraph>
        </Card>
      </div>
    </div>
  )
}

export default Privacy
