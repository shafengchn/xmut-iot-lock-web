import axios from "@/common/lib/request";

/**
 * 根据关键字分页查询用户
 * @param {分页对象}} page 
 * @returns 
 */
 export const pageUser = page => {
    return axios.request({
        url: `/user/page`,
        method: 'POST',
        data: page
    });
}

/**
 * 根据角色id分页查询用户
 * @param {分页对象}} page 
 * @returns 
 */
 export const pageUserByRoleId = page => {
    return axios.request({
        url: `/user/page-by-role`,
        method: 'POST',
        data: page
    });
}