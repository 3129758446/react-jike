import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Popconfirm } from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN'
// 导入资源
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { getArticleListAPI ,deleteArticleAPI } from '@/apis/article'
import { useEffect,useState } from 'react'
import { useChannel } from '@/hooks/useChannel'


const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
    // 准备列数据
    const { channelList } = useChannel()
    //定义枚举
    const status = { 1: <Tag color='warning'>待审核</Tag>, 2: <Tag color='success'>审核通过</Tag> }

    const columns = [
        {
            title: '封面',
            dataIndex: 'cover',
            width: 120,
            render: cover => {
                return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
            }
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220
        },
        {
            title: '状态',
            dataIndex: 'status',
            // render函数的参数就是当前单元格的数据
            // data就是后端返回的status字段的值，我们根据这个值来判断文章的状态
            //data === 1 ? '待审核' : '审核通过'
            //枚举类型 0 草稿 1 待审核 2 审核通过 3 拒绝
            render: data => {
                // return data === 1 ? <Tag color='warning'>待审核</Tag> : <Tag color='success'>审核通过</Tag>
                return status[data]
            }
        },
        {
            title: '发布时间',
            dataIndex: 'pubdate'
        },
        {
            title: '阅读数',
            dataIndex: 'read_count'
        },
        {
            title: '评论数',
            dataIndex: 'comment_count'
        },
        {
            title: '点赞数',
            dataIndex: 'like_count'
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        <Button type="primary" shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/publish?id=${data.id}`)} />
                            
                        <Popconfirm
                            title="确认删除该条文章吗?"
                            onConfirm={() => onConfirm(data)}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button
                                type="primary"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ]
    
    const navigate = useNavigate()
    //1.渲染分类列表
    //useChannel

    //2.渲染列表数据
    //列表筛选条件
    const [param , setParam] = useState({
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: 1,
        per_page: 5
    })

    const [list, setList] = useState([])
    const [count, setCount] = useState(0)
    useEffect(()=>{
        async function fetchArticleList() {
            const res = await getArticleListAPI(param)
            setList(res.data.results)
            setCount(res.data.total_count)  
        }
        fetchArticleList()
    },[param])

    //3.筛选文章
    const onFinish = async (fromValue) => {
        console.log(fromValue)
        setParam( {
            ...param,
            channel_id: fromValue.channel_id,
            status: fromValue.status,
            begin_pubdate: fromValue.date[0].format('YYYY-MM-DD'),
            end_pubdate: fromValue.date[1].format('YYYY-MM-DD'),
        })
    }

    //4.分页
    //分页功能
    const onPageChange = page => {
        //page 就是当前页码，从页面中获取到的
        //调用setReqData函数更新reqData中的page参数
        setParam({
            ...param,
            page
        })
    }

    //5.删除功能
    //删除功能
    const onConfirm = async (data) => {
        // data.id //要删除的文章id
        await deleteArticleAPI(data.id)
        console.log('删除成功')
        setParam({
            ...param,
            // page: 1 //删除文章后，重新回到第一页
        })
    }

    return (
        <div>
            <Card
                title={
                    <Breadcrumb items={[
                        { title: <Link to={'/'}>首页</Link> },
                        { title: '文章列表' },
                    ]} />
                }
                style={{ marginBottom: 20 }}
            >
                <Form
                onFinish={onFinish}
                 initialValues={{ status: '' }}>
                    <Form.Item label="状态" name="status">
                        <Radio.Group>
                            <Radio value={''}>全部</Radio>
                            <Radio value={0}>草稿</Radio>
                            <Radio value={2}>审核通过</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="频道" name="channel_id">
                        <Select
                            placeholder="请选择文章频道"
                            defaultValue="推荐"
                            style={{ width: 120 }}
                        >
                            {channelList.map(item => (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                                ))}

                        </Select>
                    </Form.Item>

                    <Form.Item label="日期" name="date">
                        {/* 传入locale属性 控制中文显示*/}
                        <RangePicker locale={locale}></RangePicker>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <div>
                <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
                    <Table rowKey="id" 
                    dataSource={list}
                    columns={columns}
                    pagination={{
                        total: count,
                        current: param.page,
                        pageSize: param.per_page,
                        onChange: onPageChange
                    }} />
                </Card>
            </div>
        </div>
        
    )
}

export default Article