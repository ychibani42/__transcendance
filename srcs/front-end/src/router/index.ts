import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SiteLayout from '../components/SiteLayout.vue'
import Axios from '../services'
import store from '../store'
import { io } from 'socket.io-client'


const routes: Array<RouteRecordRaw> = [
  
  {
    path: '/',
    name: 'SiteLayout',
    component: SiteLayout,
    children :[
          { path: '/',name: 'home',component: HomeView},
          { path: '/chat', name: 'chat',
            component: () => import(/* webpackChunkName: "about" */ '../views/ChatView.vue') },
          { path: '/profile', name: 'profile',
              component: () => import(/* webpackChunkName: "about" */ '../views/ProfileView.vue') },
          { path: '/matchmaking', name: 'matchmaking',
              component: () => import(/* webpackChunkName: "about" */ '../views/Matchmaking.vue') },
          { path: '/game', name: 'game',
              component: () => import(/* webpackChunkName: "about" */ '../views/Game.vue')},
          { path: '/Config', name: 'Config',
              component: () => import(/* webpackChunkName: "about" */ '../views/Config.vue')},
          { path: '/Twofa', name: 'Twofa',
              component: () => import(/* webpackChunkName: "about" */ '../views/Twofa.vue')}
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
    path: '/:pathMatch(.*)*', redirect : '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

async function checkJwt() : Promise<boolean>
{
  if($cookies.get('access_token') !== null)
  {
    try {
        await Axios.get('auth/Me').then(res => {
            if(res !== undefined){
              store.commit('setUserId',res.data.id)
              store.commit('setProfileC',res.data.profilefinish)
              store.commit('setTwofa',res.data.otpenable)
              store.commit('setTwofavalid', res.data.otpvalider)
              store.commit('setOnline',res.data.state)
            }
          });
          return true
    } catch (error) {
      if($cookies.get('access_token'))
        $cookies.remove('access_token')
      return false
    }
  }
  else
  {
    return false
  }
}

router.beforeEach((to, from) => {
  checkJwt().then((valid : boolean) => {
    if(store.state.user.id === 0)
    {
      $cookies.remove('access_token')
    }
    if (valid === false && to.path !== '/login' && $cookies.get('access_token') === null)
    {
      store.dispatch("reset")
      router.push("/login")
    }
    if(store.state.user.profileCompleted === false && valid === true)
    {
      router.push("/config")
    }
    if(store.state.user.Twofa === true && valid === true && store.state.user.Twofavalid == false)
    {
      router.push("/Twofa")
    }
    if(store.state.user.online == false == valid == true)
    {
      const sock = io("http://localhost:3000/state",{
        transportOptions : {
        polling :{ extraHeaders:{cookies:$cookies.get('access_token')}}}})
      store.commit('setState',sock)
    }
})
})
export default router
