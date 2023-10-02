import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SiteLayout from '../components/SiteLayout.vue'
import Axios from '../services'
import store from '../store'
import { io, Socket } from 'socket.io-client'


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
          { path: '/History', name: 'History',
              component: () => import(/* webpackChunkName: "about" */ '../views/GameHistory.vue')},
          { path: '/test', name: 'test',
              component: () => import(/* webpackChunkName: "about" */ '../views/TEST.vue')}
    ]

  },
  { path: '/Config', name: 'Config',
              component: () => import(/* webpackChunkName: "about" */ '../views/Config.vue')},
  { path: '/Twofa', name: 'Twofa',
              component: () => import(/* webpackChunkName: "about" */ '../views/Twofa.vue')},
  {
    path: '/login', name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')},
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
  if($cookies.get('access_token') != null)
  {
    await Axios.get('auth/Me').then(res => 
    {
      if(res.status == 200)
      {
        store.commit('setUserId',res.data.id)
        store.commit('setProfileC',res.data.profilefinish)
        store.commit('setTwofa',res.data.otpenable)
        store.commit('setTwofavalid', res.data.otpvalider)
        store.commit('setUsername', res.data.name)
        if(res.data.state == 'Disconected')
        { 
          store.commit('setOnline',false) 
          const sock = connect()
          store.commit('setState',sock)
          store.dispatch('Gameinvite')
          console.log("2")
        }
      }
    })
    if(store.state.user.id != 0)
      return true
    else
      return false
  }
  else
    return false
}

router.beforeEach((to, from) => {
  checkJwt().then((valid : boolean) => {
    if(store.state.user.id === 0)
    {
      $cookies.remove('access_token')
    }
    if (valid === false && to.path !== '/login')
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
    if(to.path == "/matchmaking")
    {
      store.state.state?.emit("game")
    }
})
})
export default router

function connect(){
  let sock = null
  if($cookies.get('access_token'))
  {
    console.log($cookies.get('access_token'))
    sock = io("http://localhost:3000/state",{
      transportOptions : {
      polling :{ extraHeaders:{cookies:$cookies.get('access_token')}}}
    })
    sock.emit("Connect", store.state.user.id)
  }
  if(sock == null)
  {
    return connect()
  }
  return sock;
}