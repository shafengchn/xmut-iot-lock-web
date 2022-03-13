import Vue from 'vue'
import VueRouter from 'vue-router';
import routes from "./routes.js";
import { setToken, getToken } from "@/common/utils/token";
import { login, getUserMenu } from "@/api/user/auth";
import { Message } from "view-design";
import { parseMenu } from "@/common/utils/tree";
import store from "@/store/index";

Vue.use(VueRouter)

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

const casCallBackPath = '/callback';
const loginRoutePath = '/login';
const homeRoutePath = '/home';

router.beforeEach((to, from, next) => {
	let token = getToken();
	if(to.path === casCallBackPath && !token) {
		// 未携带token跳转登录
		if(to.query.ticket) {
			// 如果携带了ticket参数 表示CAS登录回调回来，开始请求接口登录
			const close = Message.loading({ content:'登录中', duration: 0 })
			login(to.query.ticket).then(res=>{
				setToken(res.access_token, res.expires_in / 3600);
				// 开始设置路由和菜单
				return loadMenu();
			}).then(res=>{
				next({ name: homeRoutePath });
			}).catch(err => {
				if(err == "403") {
					// TODO 没有菜单权限，路由到403
				} else {
					console.error(err);
				}
			}).finally(rs=>{
				close();
			});
		} else {
			// TODO 未携带ticket参数，不合法
		}
		
	} else if (!token && to.path === loginRoutePath) {
		// 跳转登录页，并且未携带token
		return next();
	} else if (!token) {
		return next({ path: loginRoutePath });
		// 如果没登录，跳转页面进行登录
		// 回调service地址
		// const serviceUrl = 'http://localhost' + casCallBackPath;
		// cas服务器地址
		// const casServiceUrl = 'http://xxxxxxxx/login';
		// window.location.href = `${casServiceUrl}?service=${encodeURIComponent(serviceUrl)}`;
	} else if (!store.getters.menuList || !store.getters.menuList.length) {
		// 如果没有路由，
		// TODO 且不是路由到403页面
		// 开始加载菜单和路由
		loadMenu().then(res=>{
			next({ ...to });
		}).catch(err=>{
			if(err == '403') {
				// TODO 没有菜单权限，路由到403
			} else {
				console.error(err);
			}
		});
	} else if(to.path === loginRoutePath) {
		// 携带token跳转登录页
		next({ path: homeRoutePath });
	} else if (to.path === '/') {
		// 如果登录了,但跳转的是外部框架
		next({ path: homeRoutePath })
	} else {
		next();
	}
});


const loadMenu = () => {
	return new Promise((resolve, reject) => {
		getUserMenu().then(res=>{
			if(!res.data.length) {
				this.$Message.info("路由到403")
				throw '403';
			}
			// 设置菜单
			let menuTree = parseMenu(res.data, "isShow");
			store.dispatch('setMenuList', menuTree);
			// 设置路由
			addRoute("index", res.data);
			resolve();
		}).catch(err => {
			reject(err);
		})
	})
	
}

const addRoute = (parentName = "index", routeTree) => {
	routeTree.forEach(item => {
		if(item.routeName && item.routePath && item.pagePath) {
			router.addRoute(parentName, {
				path: item.routePath,
				name: item.routeName,
				component: () => import("@/views/" + item.pagePath + ".vue"),
			});
		} else if(item.children && item.children.length > 0) {
			// console.log(item)
			addRoute(parentName, item.children);
		}
		
	});
}


export default router;
