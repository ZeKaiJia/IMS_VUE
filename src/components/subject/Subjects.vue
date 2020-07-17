<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入课程号"
            v-model="queryInfo.subId"
            @clear="getSubjectList"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="selectSubject"
            />
          </el-input>
        </el-col>
        <el-col :span="2.5">
          <el-button type="primary" @click="addDialogVisible = true"
          >添加课程</el-button
          >
        </el-col>
      </el-row>
      <!--课程列表区域-->
      <el-table :data="subjectList" border>
        <el-table-column type="index" label="序号" width="58px" align="center"/>
        <el-table-column label="课程号" prop="subId" width="80px" align="center"/>
        <el-table-column label="课程名称" prop="subName" align="center"/>
        <el-table-column label="任课教师" prop="subTeacherId" width="124px" align="center"/>
        <el-table-column label="学分" prop="subCredit" width="64px" align="center"/>
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
              @change="subjectStateChange(scope.row)"
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
                @click="showEditDialog(scope.row.usrId)"
                round
              />
            </el-tooltip>
            <el-tooltip
              class="dark"
              effect="dark"
              content="删除角色"
              placement="top"
              :enterable="false"
              :hide-after="2000"
            >
              <!--删除按钮-->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.usrId)"
                round
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--显示总条目数量-->
      <el-pagination layout="total" :total="total"> </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { timestampToTime } from '../../plugins/utils'
export default {
  name: 'Subjects',
  data() {
    return {
      // 搜索信息
      queryInfo: {
        subId: ''
      },
      subjectList: [],
      total: 0,
      // 控制添加课程对话框的显示
      addDialogVisible: false,
      // 控制修改课程对话框的显示
      editDialogVisible: false
    }
  },
  created() {
    this.getSubjectList()
  },
  methods: {
    // 获取课程列表
    async getSubjectList() {
      const { data: res } = await this.$http.get('subject/selectAdmin')
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].utcCreate = timestampToTime(res.data[i].utcCreate)
        res.data[i].utcModify = timestampToTime(res.data[i].utcModify)
      }
      this.subjectList = res.data
      this.total = res.data.length
    },
    // 查找课程
    async selectSubject() {
      const { data: res } = await this.$http.get('subject/selectAdminById', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取课程列表失败!')
      }
      this.subjectList = []
      this.subjectList.push(res.data)
      this.subjectList[0].utcCreate = timestampToTime(this.subjectList[0].utcCreate)
      this.subjectList[0].utcModify = timestampToTime(this.subjectList[0].utcModify)
      this.total = res.data.length
    },
    // 监听 switch 开关的改变
    async subjectStateChange(subjectInfo) {
      if (subjectInfo.isReal === false) {
        const { data: res } = await this.$http.post(
          `subject/delete?subId=${subjectInfo.subId}`
        )
        if (res.code !== 200) {
          return this.$message.error('禁用课程失败')
        } else {
          this.getSubjectList()
          return this.$message.success('禁用课程成功')
        }
      } else {
        const { data: res } = await this.$http.post(
          `subject/reDelete?subId=${subjectInfo.subId}`
        )
        if (res.code !== 200) {
          return this.$message.error('开启课程失败')
        } else {
          this.getSubjectList()
          return this.$message.success('开启课程成功')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
