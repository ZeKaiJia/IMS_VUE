<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--学生列表区域-->
      <el-table :data="stuList" border stripe>
        <!--拓展列-->
        <el-table-column type="expand" label="详细" width="64px" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-tag
                type="info"
                effect="plain">
                出生日期
              </el-tag>
              <el-tag
                type="info"
                effect="plain">
                {{scope.row.stuBirthday}}
              </el-tag>
            </el-row>
            <el-row>
              <el-tag
                type="info"
                effect="plain">
                电子邮箱
              </el-tag>
              <el-tag
                type="info"
                effect="plain">
                {{scope.row.stuEmail}}
              </el-tag>
            </el-row>
            <el-row>
              <el-tag
                type="info"
                effect="plain">
                更多信息等待添加
              </el-tag>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index" label="序号" width="64px" align="center"/>
        <el-table-column label="学号" prop="stuId" align="center"/>
        <el-table-column label="姓名" prop="stuName" align="center"/>
        <el-table-column label="性别" prop="stuGender" width="64px" align="center"/>
        <el-table-column label="创建时间" prop="utcCreate" width="190px" align="center"/>
        <el-table-column label="修改时间" prop="utcModify" width="190px" align="center"/>
        <el-table-column label="状态" width="148px" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isReal"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
              @change="studentStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="128px" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="dark"
              effect="dark"
              content="修改信息"
              placement="top"
              :enterable="false"
              :hide-after="2000"
            >
              <!--修改按钮-->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.stuId)"
                round
              />
            </el-tooltip>
            <el-tooltip
              class="dark"
              effect="dark"
              content="删除学生"
              placement="top"
              :enterable="false"
              :hide-after="2000"
            >
              <!--删除按钮-->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeStuById(scope.row.stuId)"
                round
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { easyTimestamp, timestampToTime } from '../../plugins/utils'
export default {
  name: 'Student',
  data() {
    return {
      queryInfo: {
        stuId: ''
      },
      stuList: [],
      total: 0,
      // 控制添加用户对话框的显示
      addDialogVisible: false,
      // 控制修改用户对话框的显示
      editDialogVisible: false
    }
  },
  created() {
    this.getStudentList()
  },
  methods: {
    async getStudentList() {
      const { data: res } = await this.$http.get('student/selectAdmin')
      if (res.code !== 200) {
        return this.$message.error('获取学生列表失败!')
      }
      console.log(res.data)
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].utcCreate = timestampToTime(res.data[i].utcCreate)
        res.data[i].utcModify = timestampToTime(res.data[i].utcModify)
        res.data[i].stuBirthday = easyTimestamp(res.data[i].stuBirthday)
        res.data[i].stuGender = res.data[i].stuGender === 1 ? '男' : '女'
      }
      this.stuList = res.data
      this.total = res.data.length
    },
    // 监听 switch 开关的改变
    async studentStateChange(studentInfo) {
      if (studentInfo.isReal === false) {
        const { data: res } = await this.$http.post(
          `student/delete?stuId=${studentInfo.stuId}`
        )
        if (res.code !== 200) {
          return this.$message.error('禁用学生失败')
        } else {
          this.getStudentList()
          return this.$message.success('禁用学生成功')
        }
      } else {
        const { data: res } = await this.$http.post(
          `student/redelete?stuId=${studentInfo.stuId}`
        )
        if (res.code !== 200) {
          return this.$message.error('开启学生失败')
        } else {
          this.getStudentList()
          return this.$message.success('开启学生成功')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-left: 16px;
  margin-top: 6px;
  margin-bottom: 6px;
}
</style>
