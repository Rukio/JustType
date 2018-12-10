import Vue from 'vue'
import Router from 'vue-router'
import Index from '~/pages/index'
import Admin from '~/pages/Admin'


Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Index',
        component: Index
      },
      {
        path: '/admin',
        name: 'Admin',
        component: Admin
      }
    ]
  })
}