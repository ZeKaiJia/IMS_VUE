<template>
    <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
        <el-breadcrumb-item>学生成绩单</el-breadcrumb-item>
      </el-breadcrumb>
      <!--查询区-->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            oninput="value=value.replace(/[^\d.]/g,'')"
            v-model="queryInfo.stuId"
            placeholder="请输入学号"
            @clear="resetShow"
            clearable/>
        </el-col>
        <el-col :span="4">
          <el-button size="medium" type="primary" @click="getAllInfo">
            查询成绩单
          </el-button>
        </el-col>
      </el-row>
      <!--初始空卡片区-->
      <el-card style="margin-top: 14px" v-if="!show">
        {{this.info}}
      </el-card>
      <!--查询卡片区-->
      <el-card style="margin-top: 14px" v-if="show">
        <el-row :gutter="20">
          <el-col :span="6" align="center">
            <span style="font-weight: bold; font-size: 20px">证件照</span>
          </el-col>
          <el-col :span="18" align="center">
            <span style="font-weight: bold; font-size: 20px">基本信息</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 16px">
          <!--证件照区-->
          <el-col :span="6" align="center">
            <el-row>
              <el-image
                style="width: 16.5vw; height: 16.5vw; min-width: 145px; min-height: 145px"
                :src="picSrc"
                fit="cover"/>
            </el-row>
          </el-col>
          <!--基本信息区-->
          <el-col :span="6" align="center">
            <el-row style="margin-top: -15px;">
              <el-table :data="studentList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                <el-table-column label="姓名" prop="stuName" align="center"/>
              </el-table>
            </el-row>
            <el-row style="margin-top: 28px">
              <el-table :data="studentList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                <el-table-column label="学号" prop="stuId" align="center"/>
              </el-table>
            </el-row>
          </el-col>
          <el-col :span="6" align="center">
            <el-row style="margin-top: -15px;">
              <el-table :data="studentList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                <el-table-column label="性别" prop="stuGender" align="center"/>
              </el-table>
            </el-row>
            <el-row style="margin-top: 28px">
              <el-table :data="studentList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                <el-table-column label="邮箱" prop="stuEmail" align="center"/>
              </el-table>
            </el-row>
          </el-col>
          <el-col :span="6" align="center">
            <el-row style="margin-top: -15px;">
              <el-table :data="studentList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                <el-table-column label="生日" prop="stuBirthday" align="center"/>
              </el-table>
            </el-row>
            <el-row style="margin-top: 28px">
              <el-table :data="studentList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                <el-table-column label="年龄" prop="stuAge" align="center"/>
              </el-table>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin-top: 12px">
          <el-col align="center">
            <span style="font-weight: bold; font-size: 20px">全部成绩</span>
          </el-col>
        </el-row>
        <!--课程列表区域-->
        <el-row>
          <el-table
            :data="scoreList"
            v-loading="loading"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            border>
            <el-table-column label="课程号" prop="subId" align="center"/>
            <el-table-column label="课程名称" prop="subName" align="center"/>
            <el-table-column label="任课老师" prop="subTeacherId" align="center"/>
            <el-table-column label="分数" prop="subScore" align="center"/>
            <el-table-column label="绩点" prop="subGPA" align="center"/>
          </el-table>
        </el-row>
      </el-card>
      <!--回到顶部-->
      <el-backtop target=".el-main" :bottom="50">△</el-backtop>
    </div>
</template>

<script>
import { easyChangeGender, easyTimestamp, operateAge, operateGPA } from '../../plugins/utils'
export default {
  name: 'StuTranscripts',
  data() {
    return {
      // 显示成绩单
      show: false,
      // 搜索信息
      queryInfo: {
        stuId: '18610201'
      },
      studentList: [],
      scoreList: [],
      // 初始提示信息
      info: '成绩单（暂无数据）',
      picSrc: '',
      // 开启加载
      loading: true
    }
  },
  methods: {
    // 重置卡片显示
    resetShow() {
      this.show = false
      this.loading = true
    },
    // 查找所有相关信息
    async getAllInfo() {
      // 获取证件照
      this.picSrc = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      // 查询学生信息
      const { data: stuRes } = await this.$http.get('student/selectAdminById', {
        params: this.queryInfo
      })
      if (stuRes.code !== 200) {
        return this.$message.error('获取学生列表失败!')
      }
      this.studentList = []
      this.studentList.push(stuRes.data)
      this.studentList[0].stuBirthday = easyTimestamp(this.studentList[0].stuBirthday.valueOf())
      this.studentList[0].stuGender = easyChangeGender(this.studentList[0].stuGender)
      this.studentList[0].stuAge = operateAge(this.studentList[0].stuBirthday)
      // 查询成绩信息
      const { data: ScoRes } = await this.$http.get(
        'score/selectAdminByStuId', {
          params: this.queryInfo
        })
      if (ScoRes.code !== 200) {
        return this.$message.error('获取成绩列表失败!')
      }
      for (let i = 0; i < ScoRes.data.length; i++) {
        ScoRes.data[i].subGPA = operateGPA(ScoRes.data[i].subScore)
        ScoRes.data[i].subName = (await this.selectEachSubject(ScoRes.data[i].subId)).subName
        ScoRes.data[i].subTeacherId = (await this.selectEachSubject(ScoRes.data[i].subId)).subTeacherId
      }
      this.scoreList = ScoRes.data
      this.show = true
      this.loading = false
    },
    // 查询该学生每门课程的详细信息
    async selectEachSubject(subId) {
      const { data: subRes } = await this.$http.get(`subject/selectAdminById?subId=${subId}`)
      if (subRes.code !== 200) {
        return this.$message.error('获取课程列表失败!')
      }
      return {
        subName: subRes.data.subName,
        subTeacherId: subRes.data.subTeacherId
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
