import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistroView from '../views/RegistroView.vue'
import LoginView from "@/views/LoginView.vue";
import ResetPasswordView from "@/views/ResetPasswordView.vue";
import AccesoDenegadoView from "@/views/AccesoDenegadoView.vue";
import NutriologoLayoutView from "@/Layouts/NutriologoLayoutView.vue";
import NutriologoView from "@/views/NutriologoView.vue";
import MisPacientesView from "@/views/MisPacientesView.vue";
import {useAuthStore} from "@/stores/authStore.js";
import AdminDashboard from "@/views/AdminDashboard.vue"
import CreadorPlanesView from "@/views/CreadorPlanesView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
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
        {
            path: '/acceso-denegado',
            name: 'AccesoDenegado',
            component: AccesoDenegadoView
        },
        {
            path: '/nutriologo',
            component: NutriologoLayoutView, // Componente de layout principal
            meta: { requiresAuth: true, role: 'Nutriologo' },
            children: [
                { path: 'dashboard', component: NutriologoView },
                { path: 'pacientes', component: MisPacientesView },
                // ... otras rutas del Nutriólogo
                { path: 'creadorplanes', component: CreadorPlanesView},

            ],
        },
        {
            path: '/paciente',
            component: () => import('@/Layouts/PacienteLayoutView.vue'), // 1. El Layout
            meta: { requiresAuth: true, role: 'Paciente' }, // 2. La Seguridad
            children: [
                // 3. Las Vistas Hijas
                { path: '', redirect: 'dashboard' }, // Redirige /paciente a /paciente/dashboard
                {
                    path: 'dashboard',
                    component: () => import('@/views/PacienteDashboardView.vue')
                },
                {
                    path: 'mi-plan',
                    component: () => import('@/views/MiPlanView.vue') // (Deberás crear esta vista)
                },
                {
                    path: 'progreso',
                    component: () => import('@/views/MiProgresoView.vue') // (Deberás crear esta vista)
                }
            ]
        },




        { // <-- 2. AÑADIR LA NUEVA RUTA
            path: '/admin',
            name: 'AdminDashboard',
            component: AdminDashboard
            // Opcional: Aquí se podría añadir un "navigation guard"
            // para verificar el rol desde el frontend también.
        },

        // Rutas del Paciente (Protegidas)

    ]
})


router.beforeEach((to, from, next) => {

    // Importante: El store debe instanciarse DENTRO del guardia
    const authStore = useAuthStore();

    const requiresAuth = to.meta.requiresAuth;
    const requiredRole = to.meta.role;

    // 3. REGLA 1: ¿Ruta protegida y el usuario NO está logueado?
    if (requiresAuth && !authStore.isLoggedIn) {
        next({ path: '/ingresar' }); // Mándalo al login
        return;
    }

    // 4. REGLA 2: ¿Ruta protegida, usuario logueado, PERO el rol no coincide?
    if (requiresAuth && requiredRole && authStore.userRole !== requiredRole) {
        next({ path: '/acceso-denegado' }); // Mándalo a "No autorizado"
        return;
    }

    next();
});


export default router

