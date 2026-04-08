import { request } from "@/utils"
export const loginAPI = (formData) =>
    request.post('/authorizations', formData)

export const getUserInfoAPI = () =>
    request.get('/user/profile')