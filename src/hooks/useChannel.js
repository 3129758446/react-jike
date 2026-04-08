import { getChannelAPI } from "@/apis/article"
import { useEffect, useState } from "react"

//封装一个函数获取频道列表数据
const useChannel = () => {
    const [channelList, setChannelList] = useState([])
    useEffect(() => {
        //获取频道列表的异步函数
        const getChannelList = async () => {
            const res = await getChannelAPI()
            setChannelList(res.data.channels)
        }
        getChannelList()
    }, [])
    return { channelList }
}
export { useChannel }