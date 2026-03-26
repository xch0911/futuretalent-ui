import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Avatar, Button, Space } from 'antd'
import { UserOutlined, UserAddOutlined } from '@ant-design/icons'
import { User } from '@/types'
import styles from './index.module.css'

interface UserCardProps {
  user: User
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/user/${user.id}`)
  }

  return (
    <Card className={styles.card} hoverable onClick={handleClick}>
      <div className={styles.content}>
        <Avatar size={64} src={user.avatar} icon={<UserOutlined />} />
        <div className={styles.info}>
          <div className={styles.nickname}>{user.nickname}</div>
          {user.bio && <div className={styles.bio}>{user.bio}</div>}
        </div>
      </div>
    </Card>
  )
}

export default UserCard
