<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--添加角色按钮区-->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--卡片视图-->
      <el-card>
        <el-table :data="typeList" border stripe>
          <el-table-column type="index" label="#" width="48px" align="center"/>
          <el-table-column label="角色名称" prop="authName" align="center"/>
          <el-table-column label="角色描述" prop="description" align="center"/>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Types',
  data() {
    return {
      typeList: [
        {
          id: 1,
          authName: '管理员',
          description: '拥有进入系统后台的最高权限'
        },
        {
          id: 2,
          authName: '教师',
          description: '能管理对应的学生和课程信息'
        },
        {
          id: 3,
          authName: '学生',
          description: '能查阅学生、课程和教师信息'
        }
      ]
    }
  },
  created() {
    this.getTypeList()
  },
  methods: {
    getTypeList () {
      console.log('auto')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
