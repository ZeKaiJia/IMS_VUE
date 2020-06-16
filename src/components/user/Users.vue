<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="序号" />
        <el-table-column label="用户名" prop="usrId" />
        <el-table-column label="密码" prop="usrPassword" />
        <el-table-column label="角色" prop="usrType" />
        <el-table-column label="创建时间" prop="utcCreate" />
        <el-table-column label="最近登录时间" prop="lastLogin" />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isReal"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-tooltip
              class="dark"
              effect="dark"
              content="修改信息"
              placement="top"
              :enterable="false"
              :hide-after="2000"
            >
              <el-button type="primary" icon="el-icon-edit" size="mini" round />
            </el-tooltip>
            <el-tooltip
              class="dark"
              effect="dark"
              content="删除角色"
              placement="top"
              :enterable="false"
              :hide-after="2000"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                round
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <!--total, sizes, prev, pager, next, jumper-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 2
      },
      userList: [],
      total: 0
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('login/selectAdmin', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].utcCreate = this.timestampToTime(res.data[i].utcCreate)
        res.data[i].lastLogin = this.timestampToTime(res.data[i].lastLogin)
      }
      this.userList = res.data
      this.total = res.data.length
      console.log(this.userList)
    },
    timestampToTime(timestamp) {
      const date = new Date(timestamp)
      const Y = date.getFullYear() + '-'
      const M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      const D = date.getDate() + ' '
      const h = date.getHours() + ':'
      const m = date.getMinutes() + ':'
      const s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听 page 改变的事件
    handleCurrentChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听 switch 开关的改变
    async userStateChange(userInfo) {
      if (userInfo.isReal === false) {
        const { data: res } = await this.$http.post(
          `login/delete?usrId=${userInfo.usrId}`
        )
        if (res.code !== 200) {
          return this.$message.error('关闭用户权限失败')
        } else {
          return this.$message.success('关闭用户权限成功')
        }
      } else {
        const { data: res } = await this.$http.post(
          `login/redelete?usrId=${userInfo.usrId}`
        )
        if (res.code !== 200) {
          return this.$message.error('开启用户权限失败')
        } else {
          return this.$message.success('开启用户权限成功')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
