<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#" width="48px" align="center"/>
        <el-table-column label="权限名称" prop="authName" align="center"/>
        <el-table-column label="路径名称" prop="path" align="center"/>
        <el-table-column label="权限登记" prop="level" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data() {
    return {
      // 权限列表
      rightsList: [
        {
          id: 11,
          authName: '用户列表',
          level: '2',
          path: 'users'
        },
        {
          id: 21,
          authName: '角色列表',
          level: '1',
          path: 'types'
        },
        {
          id: 22,
          authName: '权限列表',
          level: '0',
          path: 'rights'
        },
        {
          id: 31,
          authName: '学生列表',
          level: '2',
          path: 'students'
        },
        {
          id: 41,
          authName: '教师列表',
          level: '2',
          path: 'teachers'
        },
        {
          id: 51,
          authName: '课程列表',
          level: '2',
          path: 'lessons'
        },
        {
          id: 61,
          authName: '综合数据',
          level: '0',
          path: 'status'
        }
      ]
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    getRightList () {
      console.log('auto')
    }
  }
}
</script>

<style lang="less" scoped></style>
