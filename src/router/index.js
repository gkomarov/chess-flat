import Vue from 'vue'
import Router from 'vue-router'
import AuthRegister from '@/components/AuthRegister'
import AuthLogin from '@/components/AuthLogin'
import AuthPasswordEmail from '@/components/AuthPasswordEmail'
import AuthPasswordReset from '@/components/AuthPasswordReset'
import AuthLogout from '@/components/AuthLogout'
import Buildings from '@/components/Buildings'
import BuildingMain from '@/components/BuildingMain'
import BuildingProperties from '@/components/BuildingProperties'
import HouseFloors from '@/components/HouseFloors'
import HouseFlatsSchemas from '@/components/HouseFlatsSchemas'
import HouseFloorsMarking from '@/components/HouseFloorsMarking'
import HouseProperties from '@/components/HouseProperties'
import HousePrices from '@/components/HousePrices'
import HouseChess from '@/components/HouseChess'
import HouseMain from '@/components/HouseMain'
import HouseMainProperties from '@/components/HouseMainProperties'
import HouseMainFlatsSchemas from '@/components/HouseMainFlatsSchemas'
import HouseMainFloors from '@/components/HouseMainFloors'
import HouseMainChess from '@/components/HouseMainChess'
import HouseMainFacades from '@/components/HouseMainFacades'
import store from '../store'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (store.getters.loggedIn) {
    next()
    return
  }
  next('login')
}

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/register',
      name: 'Register',
      component: AuthRegister
    },
    {
      path: '/login',
      name: 'Login',
      component: AuthLogin
    },
    {
      path: '/password/email',
      name: 'PasswordEmail',
      component: AuthPasswordEmail
    },
    {
      path: '/password/reset/:password_code',
      name: 'PasswordReset',
      component: AuthPasswordReset
    },
    {
      path: '/logout',
      name: 'Logout',
      component: AuthLogout
    },
    {
      path: '/',
      name: 'Buildings',
      component: Buildings,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/building',
      name: 'BuildingMain',
      component: BuildingMain,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/building/properties',
      name: 'BuildingProperties',
      component: BuildingProperties,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/properties',
      name: 'HouseProperties',
      component: HouseProperties,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/main',
      name: 'HouseMain',
      component: HouseMain,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/main/properties',
      name: 'HouseMainProperties',
      component: HouseMainProperties,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/main/flats-schemas',
      name: 'HouseMainFlatsSchemas',
      component: HouseMainFlatsSchemas,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/main/chess',
      name: 'HouseMainChess',
      component: HouseMainChess,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/main/floors',
      name: 'HouseMainFloors',
      component: HouseMainFloors,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/main/facades',
      name: 'HouseMainFacades',
      component: HouseMainFacades,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/flats-schemas',
      name: 'HouseFlatsSchemas',
      component: HouseFlatsSchemas,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/floors',
      name: 'HouseFloors',
      component: HouseFloors,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/floors/marking',
      name: 'HouseFloorsMarking',
      component: HouseFloorsMarking,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/chess',
      name: 'HouseChess',
      component: HouseChess,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/house/prices',
      name: 'HousePrices',
      component: HousePrices,
      beforeEnter: ifNotAuthenticated
    }
  ]
})
