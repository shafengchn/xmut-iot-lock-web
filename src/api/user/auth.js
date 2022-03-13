import axios from "@/common/lib/request";

export const login = (ticket) => {
    return axios.request({
        url: '/oauth/token',
        method: 'POST',
        auth: {
            username: 'dfyj',
            password: '123456789'
        },
        params: {
            grant_type: 'cas',
            ticket
        }
    })
}

export const getUserMenu = () => {
    return axios.request({
        url: `/user/menu`,
        method: 'GET',
    })
}