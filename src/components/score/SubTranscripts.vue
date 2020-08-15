<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" @click.native="changeMenu('/')">首页</el-breadcrumb-item>
      <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程成绩单</el-breadcrumb-item>
    </el-breadcrumb>
    <!--查询区-->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model.number="queryInfo.subId"
          type="number"
          placeholder="请输入课程号"
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
        <el-col :span="8">
          <div class="centerFont">课程封面</div>
        </el-col>
        <el-col :span="16">
          <div class="centerFont">基本信息</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 16px">
        <!--证件照区-->
        <el-col :span="8" align="center">
          <el-row>
            <el-image
              v-loading="loading"
              style="width: 22vw; height: 16.5vw; min-width: 196px; min-height: 145px"
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
        <el-col :span="8" style="align-items: center">
          <el-row style="margin-top: -15px;">
            <el-table :data="subjectList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
              <el-table-column label="名称" prop="subName" align="center"/>
            </el-table>
          </el-row>
          <el-row style="margin-top: 28px">
            <el-table :data="subjectList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
              <el-table-column label="课程号" prop="subId" align="center"/>
            </el-table>
          </el-row>
        </el-col>
        <el-col :span="8" style="align-items: center">
          <el-row style="margin-top: -15px;">
            <el-table :data="subjectList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
              <el-table-column label="教师" prop="subTeacherId" align="center"/>
            </el-table>
          </el-row>
          <el-row style="margin-top: 28px">
            <el-table :data="subjectList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
              <el-table-column label="学分" prop="subCredit" align="center"/>
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
          <el-table-column label="学号" prop="stuId" align="center"/>
          <el-table-column label="姓名" prop="stuName" align="center"/>
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
import { checkError, operateGPA } from '../../plugins/utils'
export default {
  name: 'subTranscripts',
  data() {
    return {
      // 路由url
      routeUrl: '/subTranscripts',
      // 显示成绩单
      show: false,
      // 搜索信息
      queryInfo: {
        subId: ''
      },
      subjectList: [],
      scoreList: [],
      // 初始提示信息
      info: '成绩单（暂无数据）',
      src: [
        { subId: 101, subSrc: 'http://edu-image.nosdn.127.net/8B31022A2193240C694709CFF5059FAF.jpg' },
        { subId: 102, subSrc: 'http://edu-image.nosdn.127.net/0BA3EBAE4F0DD0830165DE01D5FB56AB.jpg' },
        { subId: 103, subSrc: 'http://edu-image.nosdn.127.net/88212DCED19F8C56CAE53ABA5C2F8235.jpg' },
        { subId: 104, subSrc: 'http://edu-image.nosdn.127.net/A4C7697FCFB168E13D39CD553D414825.png' },
        { subId: 105, subSrc: 'http://edu-image.nosdn.127.net/11FE42F5F6B538AC80AF273C39DB6A51.png' },
        { subId: 106, subSrc: 'http://edu-image.nosdn.127.net/D925A704482053E86DFE73BF6F55BF85.jpg' },
        { subId: 107, subSrc: 'http://edu-image.nosdn.127.net/82FD7E223C272A5AE4BB93A1FAC3EE74.png' },
        { subId: 108, subSrc: 'http://edu-image.nosdn.127.net/126A95643574883B74BF12E1279CC7A7.jpg' },
        { subId: 109, subSrc: 'http://edu-image.nosdn.127.net/A065FC17D39ACEB56C1A94FAF6A3F543.png' },
        { subId: 110, subSrc: 'http://edu-image.nosdn.127.net/C018748CE5FEA79430BCDFF82A8147E0.png' },
        { subId: 111, subSrc: 'http://edu-image.nosdn.127.net/51462328D931F1FC86FE26B959498BFD.png' },
        { subId: 112, subSrc: 'http://edu-image.nosdn.127.net/DD9F215E67D243C6FDA4457BA7DBECB4.jpg' },
        { subId: 113, subSrc: 'http://edu-image.nosdn.127.net/99BD9B1B71C084AEFFF0C4ACFA83707D.png' },
        { subId: 114, subSrc: 'http://edu-image.nosdn.127.net/DD9F215E67D243C6FDA4457BA7DBECB4.jpg' },
        { subId: 115, subSrc: 'http://edu-image.nosdn.127.net/645FDBA5D5A3E311F264D41EECEDE477.jpg' },
        { subId: 116, subSrc: 'http://edu-image.nosdn.127.net/8B31022A2193240C694709CFF5059FAF.jpg' },
        { subId: 117, subSrc: 'http://edu-image.nosdn.127.net/4D561AF42BB03B2BA9CA349BCE61BFDF.jpg' },
        { subId: 118, subSrc: 'http://edu-image.nosdn.127.net/99BD9B1B71C084AEFFF0C4ACFA83707D.png' },
        { subId: 119, subSrc: 'http://edu-image.nosdn.127.net/AC71673DC9CDC38E8D3E0ABAC425FD76.jpg' },
        { subId: 120, subSrc: 'http://edu-image.nosdn.127.net/E539AF9CE0F7CC5919EF2D64FD250C89.jpg' },
        { subId: 121, subSrc: 'http://edu-image.nosdn.127.net/11FE42F5F6B538AC80AF273C39DB6A51.png' },
        { subId: 122, subSrc: 'http://edu-image.nosdn.127.net/E1E1EB1E00ECEE0073699A45C6B59615.jpg' },
        { subId: 123, subSrc: 'http://edu-image.nosdn.127.net/F0BA24F088BDC6C3720E6EB52698BCD5.png' },
        { subId: 124, subSrc: 'http://edu-image.nosdn.127.net/58C94DD82574A4BE7D2A905B0808B4BC.jpg' },
        { subId: 125, subSrc: 'http://edu-image.nosdn.127.net/E1E1EB1E00ECEE0073699A45C6B59615.jpg' },
        { subId: 126, subSrc: 'http://edu-image.nosdn.127.net/B21E9B84EA4D4FC4CF346B15337DE538.jpg' },
        { subId: 127, subSrc: 'http://edu-image.nosdn.127.net/D27CD3B40A81E842D7B02D3554879E49.png' },
        { subId: 128, subSrc: 'http://edu-image.nosdn.127.net/DF999058547AAAC541A8D80683475A60.jpg' },
        { subId: 129, subSrc: 'http://edu-image.nosdn.127.net/9ED565C498DFDCBD108ABF4EE861D206.jpg' },
        { subId: 130, subSrc: 'http://edu-image.nosdn.127.net/DE7BB48BFEE61200D2A1C2100BB9E652.png' },
        { subId: 131, subSrc: 'http://edu-image.nosdn.127.net/62A8ED68AADCAC844EAB06197A3A1C8E.jpeg' },
        { subId: 132, subSrc: 'http://edu-image.nosdn.127.net/490D39F94C08AA1A84926EFE89AF4ED6.png' },
        { subId: 133, subSrc: 'http://edu-image.nosdn.127.net/5B85A99F9EA75F2680F959CAA519F744.jpg' },
        { subId: 134, subSrc: 'http://edu-image.nosdn.127.net/6D85C1D8D5D1C7321B508FE9CA25EF3A.jpg' },
        { subId: 135, subSrc: 'http://edu-image.nosdn.127.net/5A51056CC9B3A059808C7340508AD915.jpg' },
        { subId: 136, subSrc: 'http://edu-image.nosdn.127.net/0FE71ECD25A855D6591740A3B8723030.jpg' },
        { subId: 137, subSrc: 'http://edu-image.nosdn.127.net/264570560635AF6B0BE5D3892201C904.png' },
        { subId: 138, subSrc: 'http://edu-image.nosdn.127.net/971EF7F9332DEA8CDC0029CEF1EAAC98.PNG' }
      ],
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
      // 查询课程信息
      const { data: subRes } = await this.$http.get('subject/selectById', {
        params: this.queryInfo
      })
      if (subRes.code !== 200) {
        return this.$message.error('获取课程列表失败!' + checkError(subRes))
      }
      this.loadPic(subRes.data.subId)
      this.subjectList = []
      this.subjectList.push(subRes.data)
      // 查询成绩信息
      const { data: scoRes } = await this.$http.get(
        'score/selectBySubjectId', {
          params: this.queryInfo
        })
      if (scoRes.code !== 200) {
        this.scoreList = []
        return this.$message.error('获取成绩列表失败!' + checkError(scoRes))
      }
      for (let i = 0; i < scoRes.data.length; i++) {
        scoRes.data[i].subGPA = operateGPA(scoRes.data[i].subScore)
        scoRes.data[i].stuName = (await this.selectEachStudent(scoRes.data[i].stuId)).stuName
        scoRes.data[i].stuEmail = (await this.selectEachStudent(scoRes.data[i].stuId)).stuEmail
      }
      this.scoreList = scoRes.data
      this.show = true
      setTimeout(() => {
        this.mainLoading = false
      }, 1000)
    },
    // 查询该课程每位学生的详细信息
    async selectEachStudent(stuId) {
      const { data: stuRes } = await this.$http.get(`student/selectById?stuId=${stuId}`)
      if (stuRes.code !== 200) {
        return this.$message.error('获取课程列表失败!' + checkError(stuRes))
      }
      return {
        stuName: stuRes.data.stuName,
        stuEmail: stuRes.data.stuEmail
      }
    },
    // 获取图片地址
    loadPic(subId) {
      // 获取上次查询的证件照
      const prePicSrc = this.picSrc
      // 判断课程获取地址
      for (const obj in this.src) {
        if (this.src[obj].subId === subId) {
          this.picSrc = this.src[obj].subSrc
        }
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
