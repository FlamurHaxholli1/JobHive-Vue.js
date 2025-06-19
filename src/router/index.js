import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authstore' // SIGUROHU që kjo është rruga e saktë

import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import Dashboard from '../views/Dashboard.vue'
import Jobs from "../views/Jobs.vue"
import JobDetails from '../views/JobDetails.vue'
import CompanyDetails from '../views/CompanyDetails.vue'
import ApplyJob from '../views/ApplyJob.vue'
import RegisterCompany from "../views/RegisterCompany.vue"
import AddJob from "../views/AddJob.vue"
import Applications from "../views/Applications.vue"
import MyApplications from "../views/MyApplications.vue"
import EditJob from "../views/EditJob.vue"

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/signup', component: SignUp },

    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/jobs', component: Jobs, meta: { requiresAuth: true } },
    { path: '/jobs/:id', name: 'JobDetails', component: JobDetails, meta: { requiresAuth: true } },
    { path: '/company/:id', name: 'CompanyDetails', component: CompanyDetails, meta: { requiresAuth: true } },
    { path: '/jobs/:id/apply', component: ApplyJob, name: 'ApplyJob', meta: { requiresAuth: true } },
    { path: '/register-company', component: RegisterCompany, meta: { requiresAuth: true, onlyEmployer: true } },
    { path: '/add-job', component: AddJob, meta: { requiresAuth: true, onlyEmployer: true } },
    { path: '/applications', component: Applications, meta: { requiresAuth: true, onlyEmployer: true } },
    { path: '/my-applications', component: MyApplications, meta: { requiresAuth: true, onlyUser: true } },

    {
        path: '/admin',
        name: 'AdminDashboard',
        component: () => import('../views/AdminDashboard.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] }
    },
    {
        path: '/profile',
        component: () => import('../views/ProfileView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/jobs/:id/edit',
        name: 'EditJob',
        component: EditJob,
        meta: { requiresAuth: true, onlyEmployer: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Auth Guard për role dhe token
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const auth = useAuthStore()

    let role = null
    if (token) {
        try {
            role = JSON.parse(atob(token.split('.')[1])).role
        } catch (e) {
            role = null
        }
    }

    // Nëse ka route që kërkon auth dhe s’ka token → dërgo në login
    if (to.meta.requiresAuth && !token) {
        return next('/login')
    }

    // Kufizim për role specifike
    if (to.meta.onlyUser && role !== 'USER') {
        return next('/dashboard')
    }
    if (to.meta.onlyEmployer && role !== 'EMPLOYER') {
        return next('/dashboard')
    }
    if (to.meta.roles && !to.meta.roles.includes(role)) {
        return next('/')
    }

    next()
})

export default router
