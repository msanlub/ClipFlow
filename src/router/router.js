
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';


const routes = [
    {path: "/", component: Home},
    {path: "/user", component: () => import ("../pages/User.vue")},
    {path: "/login", component: () => import ("../components/LoginForm.vue")},
    {path: "/register", component: () => import ("../components/RegisterForm.vue")},
    {path: "/contact", component: () => import ("../components/ContactForm.vue")},
    {path: "/:pathMatch(.*)*", component: () => import ("../pages/NoPageFound.vue")
        //redirect:"/"
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;