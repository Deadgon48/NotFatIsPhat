import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistroView from '../views/RegistroView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/inicio',
            name: 'home',
            component: HomeView
        },
        {
            path: '/registro',
            name: 'registro',
            component: RegistroView
        },
    ]
})

export default router