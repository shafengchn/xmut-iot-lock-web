import axios from "@/common/lib/request";

/**
 * 根据父级参数id获取子级参数列表
 * @param {父级参数id} parentId 
 * @returns 
 */
export const listParamByParentId = parentId => {
	return axios.request({
		url: '/param/list-by-parent-id',
		method: 'GET',
		params: {
			parentId
		}
	});
}

/**
 * 保存或修改参数
 * @param {保存对象}} param 
 * @returns 
 */
export const saveOrUpdate = param => {
	return axios.request({
		url: `/param`,
		method: 'PUT',
		data: param
	});
}

/**
 * 根据参数id删除参数
 * @param {参数id}} id 
 * @returns 
 */
export const removeById = id => {
	return axios.request({
		url: `/param/${id}`,
		method: 'DELETE',
	})
}