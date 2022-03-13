import axios from "@/common/lib/request";

export const listByParent = parentId => {
    return axios.request({
        url: '/menu/list-by-parent',
        method: 'GET',
        params: {
            parentId
        }
    });
}

export const saveOrUpdate = menu => {
    return axios.request({
        url: '/menu',
        method: 'PUT',
        data: menu
    })
}

export const removeById = menuId => {
    return axios.request({
        url: `/menu/${menuId}`,
        method: 'DELETE'
    })
}

export const treeMenu = () => {
    return axios.request({
        url: `/menu/tree-all`,
        method: 'GET'
    });
}

export const listMenuIdsByRoleId = roleId => {
    return axios.request({
        url: `/menu/role-menu/${roleId}`,
        method: 'GET'
    })
}

export const saveRoleMenu = (roleId, menuIds) => {
    return axios.request({
        url: `/menu/save-role-menu/${roleId}`,
        method: "POST",
        data: menuIds
    })
}