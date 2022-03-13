import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		menuList: null,
		userInfo: null,
	},
	mutations: {
		setMenus(state, menuList) {
			state.menuList = menuList
		},
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo;
		},
		clearVuexStore(state) {
			state.menuList = null;
			state.userInfo = null;
		}
	},
	actions: {
		setMenuList({ commit }, menuList) {
            commit('setMenus', menuList)
		},
		setUserInfo({ commit }, userInfo) {
			commit('setUserInfo', userInfo);
		},
		clearVuexStore({commit}, obj = {}) {
			commit('clearVuexStore', obj);
		}
	},
	getters: {
		menuList: state => state.menuList,
		userInfo: state => state.userInfo,
	},
	modules: {
	}

})
