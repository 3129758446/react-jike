import { request } from '@/utils/index'

// 获取分类列表
export const getChannelAPI = () =>
    request({
        url: '/channels'
    })

// 创建文章
export const createArticleAPI = (data) =>
    request({
        method: 'POST',
        url: '/mp/articles?draft=false',
        data
    })

// 获取文章列表
export const getArticleListAPI = (params) =>
    request({
        url: '/mp/articles',
        params
    })
    
//删除文章接口函数
export const deleteArticleAPI = (id) => {
    return request({
        url: `/mp/articles/${id}`,
        method: 'delete'
    })
}