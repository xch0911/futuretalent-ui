import React, { useState } from 'react'
import { Modal, Form, Select, Input, message } from 'antd'
import { createReport, CreateReportParams } from '@/services/report'

const { TextArea } = Input
const { Option } = Select

interface ReportModalProps {
  visible: boolean
  onCancel: () => void
  targetType: 'idea' | 'comment'
  targetId: number
}

const ReportModal: React.FC<ReportModalProps> = ({ visible, onCancel, targetType, targetId }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const reportTypeOptions = [
    { value: '违规内容', label: '违规内容' },
    { value: '垃圾广告', label: '垃圾广告' },
    { value: '人身攻击', label: '人身攻击' },
    { value: '其他', label: '其他' }
  ]

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      const params: CreateReportParams = {
        reportType: values.reportType,
        targetType,
        targetId,
        description: values.description
      }

      await createReport(params)
      message.success('举报提交成功，我们会尽快处理')
      form.resetFields()
      onCancel()
    } catch (error: any) {
      message.error(error.response?.data?.message || '举报提交失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="举报内容"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="reportType"
          label="举报类型"
          rules={[{ required: true, message: '请选择举报类型' }]}
        >
          <Select placeholder="请选择举报类型">
            {reportTypeOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="补充说明（可选）"
        >
          <TextArea
            rows={4}
            placeholder="请详细描述违规内容，帮助我们更好地处理"
            maxLength={1000}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ReportModal
