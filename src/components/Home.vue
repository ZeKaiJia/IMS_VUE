<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/img/avater.png" alt="" />
        <span>综合信息管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏区域-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
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
      <!--侧边栏右侧区域-->
      <el-main>
        <!--路由占位符-->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
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
          authName: '教师管理',
          children: [{
            id: 41,
            authName: '教师列表',
            path: 'teachers'
          }]
        },
        {
          id: 5,
          authName: '课程管理',
          children: [{
            id: 51,
            authName: '课程列表',
            path: 'lessons'
          }]
        },
        {
          id: 6,
          authName: '数据统计',
          children: [{
            id: 61,
            authName: '综合数据',
            path: 'status'
          }]
        }
      ],
      iconsObj: {
        1: 'iconfont icon-icon-test35',
        2: 'iconfont icon-icon-test16',
        3: 'iconfont icon-icon-test38',
        4: 'iconfont icon-icon-test37',
        5: 'iconfont icon-icon-test31',
        6: 'iconfont icon-icon-test29'
      },
      // 默认不折叠
      isCollapse: false,
      // 被激活的地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  name: 'Home',
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      // const { data: res } = await this.$http.get('login/menus')
      // if (res.code !== 200) return this.$message.error(res.message)
      // // const resData = JSON.parse(JSON.stringify(res))
      // this.menuList = res.data
      // console.log(res)
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
