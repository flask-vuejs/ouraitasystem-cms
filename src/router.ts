import {createRouter,createWebHistory} from 'vue-router'

import Home from '@/views/Home.vue'
import Datasets from '@/views/Datasets.vue'
import Groups from '@/views/Groups.vue'
import News from '@/views/News.vue'
import Papers from '@/views/Papers.vue'
import Projects from '@/views/Projects.vue'
import Users from '@/views/Users.vue'
import Banner from '@/views/banner.vue'

const router=createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            redirect: "/home"
        },
        {
            path:'/home',
            name:'home',
            component:Home
        },
        {
            path:'/datasets',
            name:'datasets',
            component:Datasets
        },
        {
            path:'/groups',
            name:'groups',
            component:Groups
        },
        {
            path:'/news',
            name:'news',
            component:News
        },
        {
            path:'/papers',
            name:'papers',
            component:Papers
        },
        {
            path:'/projects',
            name:'projects',
            component:Projects
        },
        {
            path:'/users',
            name:'users',
            component:Users
        },
        {
            path:'/banner',
            name:'banner',
            component:Banner
        }
    ]
})

export default router
