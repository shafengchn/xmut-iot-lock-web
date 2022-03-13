import axios from "@/common/lib/request";

/**
 * 所有角色列表
 * @returns 
 */
export const list = () => {
    return axios.request({
        url: '/role/list',
        method: 'GET'
    });
}

/**
 * 保存或更新角色
 * @param {角色数据} role 
 * @returns 
 */
export const saveOrUpdate = role => {
    return axios.request({
        url: '/role',
        method: 'PUT',
        data: role
    })
}

/**
 * 根据id删除角色
 * @param {角色id} roleId 
 * @returns 
 */
export const removeById = roleId => {
    return axios.request({
        url: `/role/${roleId}`,
        method: "DELETE"
    })
}

/**
 * 设置默认角色
 * @param {角色id} roleId 
 * @returns 
 */
export const setDefaultRole = roleId => {
    return axios.request({
        url: `/role/set-default/${roleId}`,
        method: 'GET'
    });
}

/**
 * 设置一个用户的角色
 * @param {用户id} userId 
 * @param {角色id} roleId 
 * @returns 
 */
export const setUserRole = (userId, roleId) => {
    return axios.request({
        url: `/role/set-user-role/${userId}/${roleId}`,
        method: 'PUT'
    })
}