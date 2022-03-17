import axios from "@/common/lib/request";

export const listParamByParentId = parentId => {
	return axios.request({
		url: '/param/list-by-parent-id',
		method: 'GET',
		params: {
			parentId
		}
	});
}