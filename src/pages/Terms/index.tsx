import React from 'react'
import { Card, Typography } from 'antd'
import styles from './index.module.css'

const { Title, Paragraph } = Typography

const Terms: React.FC = () => {
  return (
    <div className={styles.terms}>
      <div className="container">
      <Card className={styles.hero}>
          <h1 className={styles.title}>用户协议</h1>
          <p className={styles.subtitle}>请仔细阅读以下条款</p>
          <p className={styles.updateTime}>最后更新：2026 年 3 月 22 日</p>
        </Card>

        <Card className={styles.content}>
          <Title level={3}>一、协议的接受与修改</Title>
          <Paragraph>
            1.1 欢迎使用未来人才网（以下简称"本平台"）。在使用本平台前，请仔细阅读本用户协议（以下简称"本协议"）。
          </Paragraph>
          <Paragraph>
            1.2 当您注册、登录或使用本平台时，即表示您已阅读、理解并同意接受本协议的全部内容。
          </Paragraph>
          <Paragraph>
            1.3 本平台有权根据需要修改本协议内容，修改后的协议一经公布即生效。如您继续使用本平台，视为接受修改后的协议。
          </Paragraph>

          <Title level={3}>二、账号注册与使用</Title>
          <Paragraph>
            2.1 您需要提供真实、准确的注册信息，并及时更新。
          </Paragraph>
          <Paragraph>
            2.2 您应妥善保管账号和密码，不得将账号转让、出售或出借给他人。
          </Paragraph>
          <Paragraph>
            2.3 如发现账号被盗用，请立即通知本平台。
          </Paragraph>

          <Title level={3}>三、用户行为规范</Title>
          <Paragraph>
            3.1 您在使用本平台时，应遵守国家法律法规，不得发布违法、有害、侵权的内容。
          </Paragraph>
          <Paragraph>
            3.2 您不得利用本平台从事以下行为：
          </Paragraph>
          <Paragraph className={styles.list}>
            （一）发布虚假信息、诈骗信息；<br/>
            （二）侵犯他人知识产权、隐私权等合法权益；<br/>
            （三）传播病毒、恶意代码；<br/>
            （四）干扰、破坏本平台的正常运行；<br/>
            （五）其他违反法律法规或社会公德的行为。
          </Paragraph>

          <Title level={3}>四、平台内容治理规则</Title>
          <Paragraph>
            4.1 内容审核机制：本平台采用AI智能审核+敏感词拦截系统对所有公开发布的内容（想法、评论）进行自动检测，包含色情、暴力、广告、垃圾信息、人身攻击、违法违规等内容的发布请求会被直接拦截，违规情节严重的账号会被限制发布功能甚至封禁。
          </Paragraph>
          <Paragraph>
            4.2 发布频率限制：为保障平台健康有序运行，普通用户单日发布上限：
          </Paragraph>
          <Paragraph className={styles.list}>
            （一）想法内容：最多50条/天；<br/>
            （二）评论内容：最多200条/天。<br/>
            超出频率限制的发布请求会被暂时拦截，24小时后自动恢复。
          </Paragraph>
          <Paragraph>
            4.3 用户举报机制：用户有权对平台内的违规内容（想法、评论）进行举报，举报入口为内容卡片右上角「···」→「举报」，提交时可选择对应的违规类型（违规内容、垃圾广告、人身攻击等）。
          </Paragraph>
          <Paragraph>
            4.4 举报处理规则：平台收到举报后会在1-3个工作日内完成审核处理，处理结果将通过站内信反馈给举报人。平台鼓励合理合规的举报行为，严禁恶意举报、虚假举报，核实为恶意举报的账号将被限制举报功能甚至封禁。
          </Paragraph>
          <Paragraph>
            4.5 申诉机制：若用户对自己的内容处理结果有异议，可通过平台申诉通道提交复核申请，平台会在3个工作日内完成复核并反馈结果。
          </Paragraph>

          <Title level={3}>五、内容发布与授权</Title>
          <Paragraph>
            5.1 您在本平台发布的内容（包括但不限于文字、图片、视频等），您应保证拥有合法的知识产权或已获得授权。
          </Paragraph>
          <Paragraph>
            5.2 您同意授予本平台在全球范围内、免费、非独家的使用权，用于本平台的运营和推广。
          </Paragraph>
          <Paragraph>
            5.3 您有权删除自己发布的内容，但删除后无法恢复。
          </Paragraph>

          <Title level={3}>六、隐私保护</Title>
          <Paragraph>
            6.1 本平台重视用户隐私保护，详细的隐私政策请参阅《隐私政策》。
          </Paragraph>
          <Paragraph>
            6.2 本平台不会向第三方出售、出租或交易您的个人信息。
          </Paragraph>

          <Title level={3}>七、免责声明</Title>
          <Paragraph>
            7.1 本平台仅提供信息发布和交流平台，不对用户发布的内容负责。
          </Paragraph>
          <Paragraph>
            7.2 因不可抗力（如网络故障、系统维护等）导致的服务中断，本平台不承担责任。
          </Paragraph>
          <Paragraph>
            7.3 您因使用本平台而产生的任何直接或间接损失，本平台不承担责任。
          </Paragraph>

          <Title level={3}>八、协议的终止</Title>
          <Paragraph>
            8.1 您有权随时注销账号，终止使用本平台。
          </Paragraph>
          <Paragraph>
            8.2 如您违反本协议，本平台有权暂停或终止您的账号，并保留追究法律责任的权利。
          </Paragraph>

          <Title level={3}>九、法律适用与争议解决</Title>
          <Paragraph>
            9.1 本协议的订立、执行、解释及争议解决均适用中华人民共和国法律。
          </Paragraph>
          <Paragraph>
            9.2 如发生争议，双方应友好协商解决；协商不成的，任何一方均可向本平台所在地人民法院提起诉讼。
          </Paragraph>

          <Title level={3}>十、其他</Title>
          <Paragraph>
            10.1 本协议的解释、修改及最终解释权归未来人才网所有。
          </Paragraph>
          <Paragraph>
            10.2 如您对本协议有任何疑问，请通过反馈建议联系我们。
          </Paragraph>
        </Card>
      </div>
    </div>
  )
}

export default Terms
