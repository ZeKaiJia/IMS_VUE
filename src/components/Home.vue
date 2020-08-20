<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img style="margin-left: 10px" src="../assets/img/avater.png" alt="" />
        <span style="cursor: default;">综合信息管理系统</span>
      </div>
      <div>
        <span style="cursor: default">{{this.showUser}}</span>
        <div>
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏区域-->
      <el-aside :width="isCollapse ? '58px' : '180px'">
        <div class="toggle-button" @click="toggleCollapse" style="display: flex; justify-content: center">
          <i :class="'iconfont icon-icon-test39'" style="margin-left: 22px"/>
        </div>
        <!--侧边栏菜单区域-->
        <el-menu
          background-color="#203a57"
          text-color="#fff"
          active-text-color="#38ae70"
          :router="true"
          :collapse="isCollapse"
          :unique-opened="true"
          :collapse-transition="false"
          :default-active="activePath"
          :default-openeds="opened"
        >
          <!--一级菜单-->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!--一级菜单模板区-->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]" />
              <!--文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu" />
                <!--文本-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!--侧边栏右侧区域-->
        <el-main style="max-height: 88.6vh;">
          <!--路由占位符-->
          <router-view />
        </el-main>
        <el-footer height="30px">
          <div style="display: flex; justify-content: center; cursor: default">© 2020 · ims.cool 版权所有 · 浙ICP备20021194号-1
            <img src="https://img.alicdn.com/tfs/TB1Z.avK.z1gK0jSZLeXXb9kVXa-200-200.png"
                 style="width: 24px; height: 24px; margin-top: 3px; margin-left: 8px"/>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { clearCookie, getCookie } from '../plugins/utils'
export default {
  data() {
    return {
      showUser: '',
      menuList: [
        {
          id: 1,
          authName: '用户管理',
          children: [{ id: 11, authName: '用户列表', path: 'users' }]
        },
        {
          id: 2,
          authName: '权限管理',
          children: [
            { id: 21, authName: '角色列表', path: 'types' },
            { id: 22, authName: '权限列表', path: 'rights' }
          ]
        },
        {
          id: 3,
          authName: '学生管理',
          children: [{
            id: 31,
            authName: '学生列表',
            path: 'students'
          }]
        },
        {
          id: 4,
          authName: '课程管理',
          children: [{
            id: 41,
            authName: '课程列表',
            path: 'subjects'
          }]
        },
        {
          id: 5,
          authName: '成绩管理',
          children: [{
            id: 51,
            authName: '成绩列表',
            path: 'scores'
          },
          {
            id: 52,
            authName: '学生成绩单',
            path: 'stuTranscripts'
          },
          {
            id: 53,
            authName: '课程成绩单',
            path: 'subTranscripts'
          }
          ]
        },
        {
          id: 6,
          authName: '数据统计',
          children: [{
            id: 61,
            authName: '综合数据',
            path: 'statuses'
          }]
        },
        {
          id: 7,
          authName: '文档管理',
          children: [{
            id: 71,
            authName: 'API文档',
            path: 'docs'
          }]
        }
      ],
      iconsObj: {
        1: 'iconfont icon-icon-test35',
        2: 'iconfont icon-icon-test16',
        3: 'iconfont icon-icon-test38',
        4: 'iconfont icon-icon-test9',
        5: 'iconfont icon-icon-test31',
        6: 'iconfont icon-icon-test29',
        7: 'iconfont icon-icon-test13'
      },
      // 默认不折叠
      isCollapse: false,
      // 被激活的地址
      activePath: '',
      // 被打开的菜单
      opened: []
    }
  },
  created() {
    this.getMenuList()
    this.showUser = getCookie('nick')
    this.information.$on('activePath', path => {
      this.activePath = path
    })
  },
  name: 'Home',
  methods: {
    async logout() {
      window.sessionStorage.clear()
      clearCookie('nick')
      clearCookie('type')
      await this.$router.push('/login')
      await this.$http.get('user/logout')
    },
    // 获取所有的菜单
    async getMenuList() {
      const type = getCookie('type')
      if (type === 'teacher') {
        this.menuList = this.menuList.slice(2, 6)
      } else if (type === 'student') {
        this.menuList = this.menuList.slice(3, 6)
      }
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/css/menu.css';
.home-container {
  height: 100%;
}
.el-header {
  background-color: #29384c;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  img {
    width: 60px;
    height: 60px;
  }
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
      font-size: 24px;
    }
  }
}
.el-aside {
  background-color: #203a57;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: ghostwhite;
}
.iconfont {
  margin-right: 22px;
}
.toggle-button {
  background-color: #374a5d;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-avatar {
  margin-top: 4px;
  margin-right: 18px;
}
.el-footer {
  background-color: #29384c;
  color: #d7d7d7;
  text-align: center;
  line-height: 30px;
}
</style>
