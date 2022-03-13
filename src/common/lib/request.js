import _axios from "axios";
import config from "@/config/url-config.js";
import { getToken, setToken } from "@/common/utils/token";
import { Message } from 'view-design';
import store from "@/store";

export const baseUrl = process.env.NODE_ENV === "development" ? config.baseUrl.dev : config.baseUrl.pro;

class HttpRequest {
	constructor({ baseUrl }) {
		this.baseUrl = baseUrl;
	}
	getDefaultConfig() {
		return {
			baseURL: this.baseUrl,
			headers: {},
			// 静默请求，发生错误时，不采用统一响应提示
			silent: false,
		}
	}
	interceptors(instance, options) {
		// 请求拦截
		instance.interceptors.request.use(
			config => {
				const _token = getToken();
				if (_token) config.headers.Authorization = "Bearer " + _token;
				return config;
			},
			err => {
				this.showError({ content: '无法连接服务器，请尝试更换网络环境' }, options);
				return Promise.reject(err);
			}
		);

		// 响应拦截
		instance.interceptors.response.use(
			res => {
				const { data } = res;
				if (data && data.code !== 0 && options.url !== '/oauth/token') {
					this.showError({ content: `【${data.code}】 ${data.msg}` });
					return Promise.reject(data);
				}
				return Promise.resolve(data);
			},
			err => {
				// 判断是否开启静默请求
				if(err.response) {
					const { status, data } = err.response;
					if(status === 400) {
                        this.showError({ content: ( data && data.msg ) ? data.msg : '失败的请求(400)' }, options);
                    } else if (status === 401) {
						setToken("", 0);
						store.dispatch('setUserInfo', false);
						this.showError({ content: ( data && data.msg ) ? data.msg : '未授权，请先登录(401)' }, options);
					} else if(status === 404) {
						this.showError({ content: ( data && data.msg ) ? data.msg : '请求的资源不存在(404)' }, options);
					} else if(status === 502) {
						this.showError({ content: ( data && data.msg ) ? data.msg : '网关错误，请稍后重试(502)' }, options);
					} else if(status === 500) {
						this.showError({ content: ( data && data.msg ) ? data.msg : '内部错误(500)' }, options)
					}
					return Promise.reject(data);
				} else {
					this.showError({ content: '无法连接服务器' }, options);
					return Promise.reject(err);
				}
			}
		);
	}
	request(options) {
		const instance = _axios.create();
		options = Object.assign(this.getDefaultConfig(), options);
		this.interceptors(instance, options);
		return instance(options);
	}
	showError(options, axiosConfig) {
		if(axiosConfig && axiosConfig.silent) return;
		Message.error(options)
	}
}

export default new HttpRequest({
	baseUrl
});
