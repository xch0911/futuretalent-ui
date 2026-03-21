import React from 'react'
import { Collapse, Card } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import styles from './index.module.css'

const { Panel } = Collapse

const FAQ: React.FC = () => {
  const faqData = [
    {
      key: '1',
      header: '未来人才网是什么？',
      content: '未来人才网是一个让年轻人分享想法、展示才华、连接机会的平台。在这里，你可以发布创意、项目、思考，找到志同道合的伙伴，让每个想法都被看见。'
    },
    {
      key: '2',
      header: '如何发布想法？',
      content: '1. 登录账号\n2. 点击右上角"发布想法"按钮\n3. 填写标题、内容和标签\n4. 点击发布即可'
    },
    {
      key: '3',
      header: '如何与其他用户互动？',
      content: '你可以通过以下方式与其他用户互动：\n• 点赞：点击想法下方的点赞按钮\n• 评论：在想法详情页发表评论\n• 回复：回复其他用户的评论\n• 关注：点击用户头像进入主页，点击关注按钮'
    },
    {
      key: '4',
      header: '如何修改或删除已发布的想法？',
      content: '目前想法发布后暂不支持修改，但可以删除：\n1. 进入想法详情页\n2. 点击右上角的删除按钮\n3. 确认删除即可\n\n删除后无法恢复，请谨慎操作。'
    },
    {
      key: '5',
      header: '如何修改个人资料？',
      content: '1. 点击右上角头像，进入个人主页\n2. 点击"编辑资料"按钮\n3. 修改昵称、简介等信息\n4. 点击保存即可'
    },
    {
      key: '6',
      header: '如何上传头像？',
      content: '1. 进入个人主页\n2. 点击头像区域\n3. 选择图片文件\n4. 在裁剪对话框中调整图片\n5. 点击确认上传\n\n支持 JPG、PNG 格式，建议上传正方形图片。'
    },
    {
      key: '7',
      header: '如何搜索想法和用户？',
      content: '在页面顶部的搜索框中输入关键词，可以搜索：\n• 想法标题和内容\n• 用户昵称\n\n搜索结果会按相关性排序。'
    },
    {
      key: '8',
      header: '热门标签有什么用？',
      content: '热门标签显示了平台上最受欢迎的主题。点击标签可以快速筛选相关主题的想法，发现你感兴趣的内容。'
    },
    {
      key: '9',
      header: '如何反馈问题或建议？',
      content: '点击页面底部的"反馈建议"链接，填写你的问题或建议，我们会及时查看并回复。'
    },
    {
      key: '10',
      header: '平台是免费的吗？',
      content: '是的，未来人才网目前完全免费使用。我们致力于为年轻人提供一个自由表达、交流创意的平台。'
    }
  ]

  return (
    <div className={styles.faq}>
      <div className="container">
        <Card className={styles.hero}>
          <QuestionCircleOutlined className={styles.icon} />
          <h1 className={styles.title}>常见问题</h1>
          <p className={styles.subtitle}>找到你想知道的答案</p>
        </Card>

        <Card className={styles.collapseCard} style={{ marginTop: 24 }}>
          <Collapse
            defaultActiveKey={['1']}
            items={faqData.map(item => ({
              key: item.key,
              label: item.header,
              children: <p className={styles.answer}>{item.content}</p>,
            }))}
          />
        </Card>

        <Card className={styles.contactCard} style={{ marginTop: 24 }}>
          <h3>没有找到答案？</h3>
          <p>
            如果你的问题没有被解答，欢迎通过{' '}
            <a href="/feedback">反馈建议</a> 联系我们，
            我们会尽快回复。
          </p>
        </Card>
      </div>
    </div>
  )
}

export default FAQ
