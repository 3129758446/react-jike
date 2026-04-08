import { createSlice } from "@reduxjs/toolkit"
import {getToken,setToken} from "@/utils/index"
import { removeToken } from "@/utils/index"
import {loginAPI,getUserInfoAPI}  from "@/apis/user"
const userStore = createSlice({
    name: "user",
    initialState: {
        userInfo: {},
        token: getToken() || ""
    },
    reducers: {
        //同步方法
        // 设置用户token
        setUserToken(state, action) {
            state.token = action.payload
            //持久化本地
            setToken(state.token)
        },
        //获取用户信息
        setUserInfo(state, action) {
            state.userInfo = action.payload
        },
        //退出登录
        clearUserInfo(state) {
            state.userInfo = {}
            state.token = ""
            removeToken() //删除本地数据
        }
    }
})

//结构出接口方法
const { setUserToken ,setUserInfo, clearUserInfo } = userStore.actions

// 获取reducer
const userReducer = userStore.reducer

// 封装异步方法
const fetchLogin = (loginForm) => {
    return async (dispatch) => {
        // 登录请求
        const res = await loginAPI(loginForm)
        // 保存用户信息
        dispatch(setUserToken(res.data.token))
    }
}

// 获取用户信息
const fetchUserInfo = () => {
    return async (dispatch) => {
        // 获取用户信息
        const res = await getUserInfoAPI()
        // 保存用户信息
        dispatch(setUserInfo(res.data))
    }
}

export {fetchLogin ,fetchUserInfo ,clearUserInfo} 
export default userReducer