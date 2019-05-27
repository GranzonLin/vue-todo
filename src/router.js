import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Login',
            component: () => import('./views/front/Login.vue')
        },
        {
            path: '/todo',
            name: 'Todo',
            component: () => import( './views/front/Todo.vue')
        }
    ]
})
