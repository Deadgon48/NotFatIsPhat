// src/router/index.js
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
import AjustesPerfilView from "@/views/AjustesPerfilView.vue";

import { useAuthStore } from '@/stores/authStore.js'

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
    // Ruta “oficial” de login
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    // Compatibilidad con la ruta vieja /ingresar
    {
      path: '/ingresar',
      redirect: '/login'
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

    // RUTAS NUTRIÓLOGO (PROTEGIDAS)
    {
      path: '/nutriologo',
      component: NutriologoLayoutView, // layout principal
      meta: { requiresAuth: true, role: 'Nutriologo' },
      children: [
        { path: 'dashboard', component: NutriologoView },
        { path: 'pacientes', component: MisPacientesView },
        { path: 'creadorplanes', component: CreadorPlanesView }
      ]
    },

    // RUTAS PACIENTE (PROTEGIDAS)
    {
      path: '/paciente',
      component: () => import('@/Layouts/PacienteLayoutView.vue'),
      meta: { requiresAuth: true, role: 'Paciente' },
      children: [
        { path: '', redirect: 'dashboard' },
        {
          path: 'dashboard',
          component: () => import('@/views/PacienteDashboardView.vue')
        },
        {
          path: 'mis-planes',
          name: 'misplanes',
          component: () => import('@/views/MiPlanView.vue')
        },
        {
          path: 'mis-planes/:idPlan',
          name: 'MiPlan',
          component: () => import('@/views/MiPlanView.vue'),
          props: true
        },
        {
          path: 'mis-planes/:idPlan/alimento/:idAlimento',
          name: 'DetalleAlimento',
          component: () => import('@/views/DetalleAlimento.vue'),
          props: true
        },
        {
            path: '/nutriologo',
            component: NutriologoLayoutView, // Componente de layout principal
            meta: { requiresAuth: true, role: 'Nutriologo' },
            children: [
                { path: 'dashboard', component: NutriologoView },
                { path: 'pacientes', component: MisPacientesView },
                { path: 'AjustesPerfil', component: AjustesPerfilView },
                // ... otras rutas del Nutriólogo
                { path: 'creadorplanes', component: CreadorPlanesView},

            ],
        },
        {
            path: '/paciente',
            component: () => import('@/Layouts/PacienteLayoutView.vue'),
            meta: { requiresAuth: true, role: 'Paciente' },
            children: [
                { path: '', redirect: 'dashboard' },

                {
                    path: 'dashboard',
                    component: () => import('@/views/PacienteDashboardView.vue')
                },

                // Lista de planes del paciente
                {
                    path: 'mis-planes',
                    name: 'misplanes',
                    component: () => import('@/views/MiPlanView.vue')
                },

                // Ver un plan específico
                {
                    path: 'mis-planes/:idPlan',
                    name: 'MiPlan',
                    component: () => import('@/views/MiPlanView.vue'),
                    props: true
                },

                // Ver alimento dentro del plan
                {
                    path: 'mis-planes/:idPlan/alimento/:idAlimento',
                    name: 'DetalleAlimento',
                    component: () => import('@/views/DetalleAlimento.vue'),
                    props: true
                },

                {
                    path: 'progreso',
                    component: () => import('@/views/MiProgresoView.vue')
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

    // (Podrías añadir una ruta 404 catch-all si lo ves necesario)
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role
  const isLoggedIn = authStore.isLoggedIn
  const userRole = authStore.userRole

  // Si ya está logueado e intenta ir al login, mándalo a su dashboard
  if (isLoggedIn && (to.path === '/login' || to.path === '/ingresar')) {
    if (userRole === 'Nutriologo') {
      return next('/nutriologo/dashboard')
    }
    if (userRole === 'Paciente') {
      return next('/paciente/dashboard')
    }
    // fallback
    return next('/')
  }

  // REGLA 1: ruta protegida y NO logueado → al login
  if (requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  // REGLA 2: ruta protegida, logueado, pero rol incorrecto → acceso denegado
  if (requiresAuth && requiredRole && userRole !== requiredRole) {
    return next('/acceso-denegado')
  }

  // todo ok
  next()
})

export default router
