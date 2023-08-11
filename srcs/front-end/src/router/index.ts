import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ChatView from '../views/ChatView'

/*
const routes = [
  { path: '/', component: Home },
  { path: '/eggs/:eggType', name: 'eggs', component: () => import('../views/Eggs.vue') },
  { path: '/eggs', redirect: '/eggs/chicken-egg' },
  { path: '/:pathMatch(.*)*', component: () => import('../views/NotFound.vue') }
]
*/

const routes = 	routes: [
		{ path: '/', component: Home },
		{ path: '/chat', component: ChatView },
	];

const router = VueRouter.createRouter({
	history: VueRouter.createWebHistory(),
	routes,
})

export default router