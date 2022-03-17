import axios from "@/common/lib/request";

export const casLogin = (ticket) => {
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

export const login = ({username, password}) => {
    return axios.request({
        url: '/oauth/token',
        method: 'POST',
        auth: {
            username: 'dfyj',
            password: '123456789'
        },
        params: {
            grant_type: 'password',
            username: username,
            password: password
        }
    })
}

export const getUserMenu = () => {
    return axios.request({
        url: `/user/menu`,
        method: 'GET',
    })
}