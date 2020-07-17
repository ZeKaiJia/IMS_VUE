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
          <el-button type="primary" disabled>添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="typeList" border stripe>
        <el-table-column type="index" label="#" width="48px" align="center"/>
        <el-table-column label="角色名称" prop="authName" align="center"/>
        <el-table-column label="角色描述" prop="description" align="center"/>
        <el-table-column label="操作" width="340px" align="center">
          <template slot-scope="">
            <el-button type="primary" icon="el-icon-edit" size="mini" disabled>编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" disabled>删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" disabled>分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
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
          description: '能查阅学生、课程的综合信息'
        }
      ]
    }
  },
  created() {
    this.getTypeList()
  },
  methods: {
    getTypeList () {
      this.$message.warning('角色暂不支持自定义')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
