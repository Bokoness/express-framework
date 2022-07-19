import Vue from "vue"
import Vuex from "vuex"
import authModule from "./modules/authModule"
Vue.use(Vuex)

const modules = {
  auth: authModule,
  event: eventModule,
}

let vuexData = {
  state: {
    title: "zahi",
    backgroundImage: "/images/Artboard_2@2x.png",
  },
  getters: {
    title: state => state.title,
    backgroundImage: state => state.backgroundImage,
  },
  mutations: {
    setBackgroundImage: (state, payload) =>
      (state.backgroundImage = `/images/${payload}.png`),
  },
  modules,
}
export default new Vuex.Store(vuexData)
