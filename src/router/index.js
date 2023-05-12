import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const searchCrawledInfo = r => require.ensure([], () => r(require('@/page/spider/searchCrawledInfo')), 'searchCrawledInfo');
const scriptManagement = r => require.ensure([], () => r(require('@/page/spider/scriptManagement')), 'scriptManagement');

const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			path: '/scriptManagement',
			component: scriptManagement,
			meta: ['爬虫', '脚本管理']
		},{
			path: '/searchCrawledInfo',
			component: searchCrawledInfo,
			meta: ['爬虫', '数据查询']
		}]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
