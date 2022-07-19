import axios from "axios"

export default {
  state: {
    isAuth: false,
    team: null,
    username: null,
    role: null,
    teams: [],
  },
  getters: {
    username: (state) => state.username,
    team: (state) => state.team,
    isAuth: (state) => state.isAuth,
    role: (state) => state.role,
    teams: (state) => state.teams,
  },
  mutations: {
    setUserName: (state, payload) => (state.username = payload),
    setTeams: (state, payload) => (state.teams = payload),
    "auth/login": (state, user) => {
      state.isAuth = true
      state.team = user.team
      state.username = user.username
      state.role = user.role
    },
    clearData: (state) => {
      state.isAuth = false
      state.team = null
      state.username = null
      state.role = null
    },
  },
  actions: {
    "auth/register": async (context, payload) => {
      let { data } = await axios.post("/auth/register", payload)
      context.commit("auth/login", data)
    },
    "auth/login": async (context, payload) => {
      await axios.post(`/auth/login/${payload.team}`, payload)
      context.commit("auth/login", payload)
    },
    "auth/checkLogin": async (context) => {
      try {
        let { data } = await axios.get("/auth/checkLogin")
        context.commit("auth/login", data)
      } catch (e) {
        throw new Error()
      }
    },
    "auth/logout": async (context) => {
      await axios.post("/auth/logout")
      context.commit("clearData")
    },
    "auth/teams": async (context) => {
      let { data } = await axios.get("/auth/teams")
      context.commit("setTeams", data)
    },
  },
}
