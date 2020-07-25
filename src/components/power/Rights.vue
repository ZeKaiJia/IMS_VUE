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
      <!--添加角色按钮区-->
      <el-row :gutter="10">
        <el-col :span="2.5">
          <el-button type="primary" disabled>添加权限</el-button>
        </el-col>
        <el-col :span="2">
          <el-tooltip class="item" effect="light" placement="right" style="margin-top: 10px">
            <div slot="content">
              一级权限为学生权限<br/>
              二级权限为教师权限<br/>
              三级权限为管理员权限
            </div>
            <el-button style="padding: 0; border-color: white" circle>
              <i class="el-icon-info" style="font-size: 20px"/>
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-table
        :data="rightsList"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
        stripe
      >
        <el-table-column type="index" label="#" width="48px" align="center"/>
        <el-table-column label="权限名称" prop="authName" align="center"/>
        <el-table-column label="路径名称" prop="path" align="center"/>
        <el-table-column label="权限等级" prop="level" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total" :total="total"> </el-pagination>
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
          level: '2',
          path: 'types'
        },
        {
          id: 22,
          authName: '权限列表',
          level: '2',
          path: 'rights'
        },
        {
          id: 31,
          authName: '学生列表',
          level: '1',
          path: 'students'
        },
        {
          id: 41,
          authName: '课程列表',
          level: '1',
          path: 'subjects'
        },
        {
          id: 51,
          authName: '成绩列表',
          level: '1',
          path: 'scores'
        },
        {
          id: 52,
          authName: '学生成绩单',
          level: '0',
          path: 'stuTranscripts'
        },
        {
          id: 53,
          authName: '课程成绩单',
          level: '1',
          path: 'subTranscripts'
        },
        {
          id: 61,
          authName: '综合数据',
          level: '0',
          path: 'status'
        }
      ],
      total: 7
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    getRightList () {
      this.$message.warning('权限暂不支持自定义')
    }
  }
}
</script>

<style lang="less" scoped></style>
