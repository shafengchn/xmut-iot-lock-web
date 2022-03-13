export default [
	{
		path: "/",
		name: 'index',
		component: () => import("../views/framework/index.vue"),
		children: [
			// {
			// 	path: '/home',
			// 	name: 'home',
			// 	component: () => import("../views/home/index.vue")
			// },
			// {
			// 	path: '/sys-menu',
			// 	name: 'sys-menu',
			// 	component: () => import("../views/sys/menu/index.vue")
			// },
			{
				path: '/sys-role',
				name: 'sys-role',
				component: () => import("../views/sys/role/index.vue")
			}
		]
	},
	{
		path: '/login',
		name: 'login',
		component: () => import("../views/login/index.vue"),
	}
]