<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" @click.native="changeMenu('/')">首页</el-breadcrumb-item>
      <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生成绩单</el-breadcrumb-item>
    </el-breadcrumb>
    <!--查询区-->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="queryInfo.stuId"
          placeholder="请输入学号"
          @clear="resetShow"
          clearable/>
      </el-col>
      <el-col :span="3">
        <el-button size="medium" type="primary" @click="getAllInfo">
          查询成绩单
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-alert
          title="输入信息查询成绩"
          type="info">
        </el-alert>
      </el-col>
    </el-row>
    <!--初始空卡片区-->
    <el-card style="margin-top: 14px" v-if="!show">
      {{this.info}}
    </el-card>
    <!--查询卡片区-->
    <el-card style="margin-top: 14px" v-if="show" v-loading="mainLoading">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="centerFont">证件照</div>
        </el-col>
        <el-col :span="18">
          <div class="centerFont">基本信息</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 16px">
        <!--证件照区-->
        <el-col :span="6" align="center">
          <el-row>
            <el-image
              v-loading="loading"
              style="width: 16.5vw; height: 16.5vw; min-width: 145px; min-height: 145px"
              :src="picSrc"
              fit="cover"
              @load="loadSuccess"
              @error="loadError"
            >
              <div slot="error" class="image-slot"
                   style="display: flex; justify-content: center; align-items: center; height: 100%; flex-flow: column">
                <span class="el-icon-picture-outline" style="width: 48px; height: 48px; font-size: 48px"/>
                <span style="margin-top: 12px">加载失败</span>
              </div>
            </el-image>
          </el-row>
        </el-col>
        <!--基本信息区-->
        <el-col :span="6" style="align-items: center">
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
        <el-col :span="6" style="align-items: center">
          <el-row style="margin-top: -15px;">
            <el-table :data="studentList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
              <el-table-column label="性别" prop="stuGender" align="center"/>
            </el-table>
          </el-row>
          <el-row style="margin-top: 28px;">
            <el-table :data="studentList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
              <el-table-column label="生日" prop="stuBirthday" align="center"/>
            </el-table>
          </el-row>
        </el-col>
        <el-col :span="6" style="align-items: center">
          <el-row style="margin-top: -15px">
            <el-table :data="studentList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
              <el-table-column label="邮箱" prop="stuEmail" align="center"/>
            </el-table>
          </el-row>
          <el-row style="margin-top: 28px">
            <el-table :data="studentList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
              <el-table-column label="电话" prop="stuPhone" align="center"/>
            </el-table>
          </el-row>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col>
          <div class="centerFont">全部成绩</div>
        </el-col>
      </el-row>
      <!--课程列表区域-->
      <el-row>
        <el-table
          :data="scoreList"
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
import { checkError, easyChangeGender, easyTimestamp, operateGPA } from '../../plugins/utils'
export default {
  name: 'StuTranscripts',
  data() {
    return {
      // 路由url
      routeUrl: '/stuTranscripts',
      // 显示成绩单
      show: false,
      // 搜索信息
      queryInfo: {
        stuId: ''
      },
      studentList: [],
      scoreList: [],
      // 初始提示信息
      info: '成绩单（暂无数据）',
      // 图片地址
      src: [
        'http://s1.wailian.download/2020/07/25/10.jpg',
        'http://s1.wailian.download/2020/07/25/9.jpg',
        'http://s1.wailian.download/2020/07/25/8.jpg',
        'http://s1.wailian.download/2020/07/25/48115bc5f6b28f420.jpg',
        'http://s1.wailian.download/2020/07/25/17fa9bfce491ad355.jpg',
        'http://s1.wailian.download/2020/07/25/340a681c7decd4737.jpg',
        'http://s1.wailian.download/2020/07/25/2624999114ba2e4b2.jpg',
        'http://s1.wailian.download/2020/07/25/77f2cb01e10ff9b38.jpg',
        'http://s1.wailian.download/2020/07/25/555a8c4ec25caa5c0.jpg',
        'http://s1.wailian.download/2020/07/25/6cc62a32fd0f389f4.jpg'
      ],
      picSrc: '',
      // 开启加载
      loading: true,
      mainLoading: true
    }
  },
  created () {
    this.information.$emit('activePath', this.routeUrl)
  },
  methods: {
    // 重置卡片显示
    resetShow() {
      this.mainLoading = true
      setTimeout(() => {
        this.show = false
      }, 1000)
    },
    // 查找所有相关信息
    async getAllInfo() {
      // 查询学生信息
      const { data: stuRes } = await this.$http.get('student/selectById', {
        params: this.queryInfo
      })
      if (stuRes.code !== 200) {
        return this.$message.error('获取学生列表失败!' + checkError(stuRes))
      }
      this.loadPic(stuRes.data.stuGender)
      this.studentList = []
      this.studentList.push(stuRes.data)
      this.studentList[0].stuBirthday = easyTimestamp(this.studentList[0].stuBirthday.valueOf())
      this.studentList[0].stuGender = easyChangeGender(this.studentList[0].stuGender)
      // 查询成绩信息
      const { data: scoRes } = await this.$http.get(
        'score/selectByStudentId', {
          params: this.queryInfo
        })
      if (scoRes.code !== 200) {
        return this.$message.error('获取成绩列表失败!' + checkError(scoRes))
      }
      for (let i = 0; i < scoRes.data.length; i++) {
        scoRes.data[i].subGPA = operateGPA(scoRes.data[i].subScore)
        scoRes.data[i].subName = (await this.selectEachSubject(scoRes.data[i].subId)).subName
        scoRes.data[i].subTeacherId = (await this.selectEachSubject(scoRes.data[i].subId)).subTeacherId
      }
      this.scoreList = scoRes.data
      this.show = true
      setTimeout(() => {
        this.mainLoading = false
      }, 1000)
    },
    // 查询该学生每门课程的详细信息
    async selectEachSubject(subId) {
      const { data: subRes } = await this.$http.get(`subject/selectById?subId=${subId}`)
      if (subRes.code !== 200) {
        return this.$message.error('获取课程列表失败!' + checkError(subRes))
      }
      return {
        subName: subRes.data.subName,
        subTeacherId: subRes.data.subTeacherId
      }
    },
    // 获取图片地址
    loadPic(gender) {
      // 获取上次查询的证件照
      const prePicSrc = this.picSrc
      // 判断性别获取地址
      if (gender === 1) {
        this.picSrc = this.src[Math.floor(Math.random() * 5) + 5]
      } else {
        this.picSrc = this.src[Math.floor(Math.random() * 5)]
      }
      // 如果图片地址不相同则开启加载
      if (prePicSrc !== this.picSrc) {
        this.loading = true
      }
    },
    // 图片加载成功
    loadSuccess() {
      this.loading = false
    },
    // 图片加载失败
    loadError() {
      this.loading = false
    },
    // 面包屑导航切换
    changeMenu(activePath) {
      this.information.$emit('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
  .centerFont {
    font-weight: bold;
    font-size: 20px;
    text-align: center;
  }
</style>
