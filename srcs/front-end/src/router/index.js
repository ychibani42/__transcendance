import {createRouter ,createWebHistory}from 'vue-router'
import About from "../views/About.vue"
import Home from '../views/Home.vue'
import Test from '../views/Test.vue'
import Login from '../views/Login.vue'
import Axios from '../services'

const routes = [
    {
        path: '/',
        name : 'Home',
        component : Home,
        children : [
            {   path: '/Test',name : 'Test',component : Test },
            {   path: '/About',name : 'About',component : About },
        ]
    },
    {
        path: '/login',
        name : 'Login',
        component : Login
    },
    {
        path: "/:pathMatch(.*)*", redirect: "/login"
    }
]

const router = createRouter({
    history : createWebHistory(),
    routes
})

router.beforeEach((to,from) =>
{
    console.log("TO",to)
    console.log("FROM",from)
    if (to.name == 'Login')
    {
        return
    }
    try {
        Axios.get("auth/CheckjWt");
    } catch (error) {
    }
})

export default router