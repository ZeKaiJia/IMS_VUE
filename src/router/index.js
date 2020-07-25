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

Vue.use(Router)

// eslint-disable-next-line no-undef
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
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
        { path: '/subTranscripts', component: SubTranscripts }
      ]
    }
  ]
})
// // 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') return next()
//   // 从sessionStorage中获取保存的token
//   const tokenStr = window.sessionStorage.getItem('token')
//   // 没有token强制跳转
//   if (!tokenStr) return next('/login')
//   next()
// })

export default router
