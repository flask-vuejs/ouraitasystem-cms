import {createRouter,createWebHistory} from 'vue-router'

import Home from '@/views/Home.vue'
import Datasets from '@/views/Datasets.vue'
import Groups from '@/views/Groups.vue'
import News from '@/views/News.vue'
import Papers from '@/views/Papers.vue'
import Hxxm from '@/views/Hxxm.vue'
import Zxxm from '@/views/Zxxm.vue'
import Paper_add from '@/views/Paper_add.vue'

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
            path:'/hxxm',
            name:'hxxm',
            component:Hxxm
        },
        {
            path:'/zxxm',
            name:'zxxm',
            component:Zxxm
        },
        {
            path:'/paper_add',
            name:'Paper_add',
            component:Paper_add
        }
    ]
})

export default router
