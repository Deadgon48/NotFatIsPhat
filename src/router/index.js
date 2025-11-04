import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistroView from '../views/RegistroView.vue'
import LoginView from "@/views/LoginView.vue";
import ResetPasswordView from "@/views/ResetPasswordView.vue";

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
        {
            path: '/ingresar',
            name: 'ingresar',
            component: LoginView
        },
        {
            path: '/reset-password',
            name: 'ResetPassword',
            component: ResetPasswordView
        },
    ]
})

export default router