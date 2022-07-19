import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../views/Login.vue"
import DashboardUserCold from "../views/DashboardUserCold.vue"
import DashboardAdmin from "../views/DashboardAdmin.vue"
import DashboardUser from "../views/Dashboard.vue"
import TodoPage from "../views/EventUser.vue"
import EventAdmin from "@/views/EventAdmin.vue"
import store from "@/store"

Vue.use(VueRouter)

const LoginGuard = (to, from, next) => {
  if (!store.getters.isAuth) {
    return to.name === "Login" ? next() : next({name: "Login"})
  }
  return next({name: "DashboardUserCold"})
}

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    beforeEnter: LoginGuard,
  },
  {
    path: "/dashboard-admin",
    name: "DashboardAdmin",
    component: DashboardAdmin,
  },
  {
    path: "/event-admin",
    name: "EventAdmin",
    component: EventAdmin,
  },
  {
    path: "/dashboard-user",
    name: "DashboardUser",
    component: DashboardUser,
  },
  {
    path: "/dashboard-user-cold",
    name: "DashboardUserCold",
    component: DashboardUserCold,
  },
  {
    path: "/todo/:category",
    name: "TodoPage",
    component: TodoPage,
  },
  {
    path: "/*",
    name: "NotFound",
    redirect: "/",
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})
router.beforeResolve((to, from, next) => {
  const isWarm = store.getters.events.length
  const isAuth = store.getters.isAuth

  if (!isAuth) {
    return to.name === "Login" ? next() : next({name: "Login"})
  }

  if (to.name.includes("DashboardUser")) {
    if (isWarm) {
      return to.name === "DashboardUser"
        ? next()
        : next({name: "DashboardUser"})
    }
    return to.name === "DashboardUserCold"
      ? next()
      : next({name: "DashboardUserCold"})
  }
  return next()
})
export default router
