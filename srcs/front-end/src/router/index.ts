import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SiteLayout from '../components/SiteLayout.vue'
import Axios from '../services'

const routes: Array<RouteRecordRaw> = [
  
  {
    path: '/',
    name: 'SiteLayout',
    component: SiteLayout,
    children :[
          { path: '/home',name: 'home',component: HomeView},
          { path: '/chat', name: 'chat',
            component: () => import(/* webpackChunkName: "about" */ '../views/ChatView.vue') },
          { path: '/profile', name: 'profile',
              component: () => import(/* webpackChunkName: "about" */ '../views/ProfileView.vue') },
          { path: '/matchmaking', name: 'matchmaking',
              component: () => import(/* webpackChunkName: "about" */ '../views/Matchmaking.vue') },
          {
            path: '/game', name: 'game',
              component: () => import(/* webpackChunkName: "about" */ '../views/Test.vue')}
    ]

  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/:pathMatch(.*)*', redirect : '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.

  if(to.path == "/")
    router.push("/home");
  Axios.get("auth/checkjwt");
  next()
})

export default router
