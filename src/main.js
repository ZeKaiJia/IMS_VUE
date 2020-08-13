import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/icon/iconfont.css'
import axios from 'axios'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 需求样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 配置请求的根路径
// axios.defaults.baseURL = 'http://test.ims.cool:9988'
axios.defaults.baseURL = 'http://localhost:9988'
axios.defaults.withCredentials = true
// // axios请求拦截
// axios.interceptors.request.use((config) => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })

Vue.config.productionTip = false
Vue.prototype.$http = axios

// 注册富文本编辑器
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')

axios.interceptors.request.use(
  function(config) {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken && accessToken !== '') {
      config.headers.common.Authorization = accessToken
    }
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    const accessToken = response.headers.authorization
    if (accessToken && accessToken !== '') {
      localStorage.setItem('accessToken', accessToken)
    }
    response.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error)
  }
)
