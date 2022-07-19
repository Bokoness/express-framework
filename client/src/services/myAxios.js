import axios from "axios"
import Notifications from "./notifications"
import i18n from "../i18n"

const myAxios = axios.create({
  headers: {
    Authorization: `Bearer ${window.localStorage.getItem("authenticToken")}`,
  },
})

function extractClapError(e) {
  let lang = i18n._vm.locale || "he"
  if (e && e.response && e.response.data && e.response.data.clapErr) {
    let errObj = e.response.data
    return errObj[lang]
  } else {
    return "משהו השתבש"
  }
}

myAxios.interceptors.request.use((config) => {
  return config
})

myAxios.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    Notifications.errorToast("", extractClapError(error))
    return Promise.reject(error)
  }
)

export default myAxios
