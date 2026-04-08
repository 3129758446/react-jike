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