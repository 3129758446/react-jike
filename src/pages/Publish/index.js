import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import {  useState } from 'react'
import { createArticleAPI } from '@/apis/article'
import { useChannel } from '@/hooks/useChannel'

const { Option } = Select

const Publish = () => {


    // 1.获取频道列表
    const { channelList } = useChannel()
    const navigate = useNavigate()

    // 2.发布文章
    const onFinish = async (formValue) => {
        console.log(formValue)
        if (imageType !== imageList.length) 
            return message.warning('图片类型和数量不一致')
        const { content, title, channel_id } = formValue
        const data = {
            title,
            content,
            cover: {
                type: imageType,
                // 新增图片逻辑，不适用编辑，需要做兼容处理
                images: imageList.map(item => {
                    if (item.response) {
                        return item.response.data.url
                    } else return item.url
                }) //拿到图片上传成功后返回的图片地址
            },
            channel_id,
        }
        await createArticleAPI(data)
        message.success('发布文章成功')
        navigate('/article')
    }
   
    
    //3.图片上传
    const [imageList, setImageList] = useState([])
    const onUploadChange = (info) => { 
        setImageList(info.fileList)  // 更新图片列表
    }
    //4.切换图片类型
    // 控制图片Type
    const [imageType, setImageType] = useState(1) // 0-无图 1-单图 3-三图
    const onTypeChange = (e) => {
        // console.log(e)
        const type = e.target.value
        setImageType(type)    
    }
   
    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb items={[
                        { title: <Link to={'/'}>首页</Link> },
                        { title: '发布文章' },
                    ]}
                    />
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 1 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder="请输入文章标题" style={{ width: 400 }} />
                    </Form.Item>
                    <Form.Item
                        label="频道"
                        name="channel_id"
                        rules={[{ required: true, message: '请选择文章频道' }]}
                    >
                        <Select placeholder="请选择文章频道" style={{ width: 400 }}>
                            {channelList.map(item =>{
                                return <Option key={item.id} value={item.id}>{item.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="封面">
                        <Form.Item name="type">
                            <Radio.Group onChange={onTypeChange}>
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {/* 
                        listType:上传列表的外框样式 
                        showUploadList:是否显示上传列表
                        */}
                        {imageType > 0 && <Upload
                            listType="picture-card"
                            showUploadList
                            // 上传地址
                            action={'http://geek.itheima.net/v1_0/upload'}
                            name='image'
                            onChange={onUploadChange}
                            maxCount={imageType} //限制上传图片数量  
                            fileList={imageList} //受控组件，手动控制fileList的值
                        >
                            <div style={{ marginTop: 8 }}>
                                <PlusOutlined />
                            </div>
                        </Upload>}
                    </Form.Item>
                    
                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{ required: true, message: '请输入文章内容' }]}
                    >
                        {/* 富文本编辑器*/}
                        <ReactQuill
                            className='publish-quill'
                            theme="snow"
                            placeholder="请输入文章内容" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit"  >
                                发布文章
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Publish