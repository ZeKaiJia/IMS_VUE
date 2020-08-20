import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Types from '../components/power/Types'
import Students from '../components/student/Students'
import Subjects from '../components/subject/Subjects'
import Scores from '../components/score/Scores'
import StuTranscripts from '../components/score/StuTranscripts'
import SubTranscripts from '../components/score/SubTranscripts'
import Statuses from '../components/status/Statuses'
import NotFound404 from '../components/NotFound404'
import Docs from '../components/doc/Docs'
import { getCookie } from '../plugins/utils'
Vue.use(Router)

// eslint-disable-next-line no-undef
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/404', component: NotFound404 },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/types', component: Types },
        { path: '/students', component: Students },
        { path: '/subjects', component: Subjects },
        { path: '/scores', component: Scores },
        { path: '/stuTranscripts', component: StuTranscripts },
        { path: '/subTranscripts', component: SubTranscripts },
        { path: '/statuses', component: Statuses },
        { path: '/docs', component: Docs }
      ]
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // 从cookie中获取保存的数据
  const cookie = getCookie('rememberMe')
  if (to.path === '/login') {
    return next()
  } else {
    // 没有token强制跳转
    if (!cookie) {
      return next('/login')
    } else {
      next()
    }
  }
})

export default router
