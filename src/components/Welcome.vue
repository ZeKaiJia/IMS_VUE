<template>
  <div>
    <el-row type="flex" justify="center">
      <span class="title">浙江理工大学科技与艺术学院</span>
    </el-row>
    <el-row type="flex" justify="center">
      <el-carousel :interval="4000" arrow="always" height="560px" style="width: 1150px">
        <el-carousel-item v-for="item in src" :key="item">
          <el-image
            :src="item"
            style="height: 580px"
            fit="cover"
          />
        </el-carousel-item>
      </el-carousel>
    </el-row>
    <el-card class="card">
      <el-row :gutter="20">
          <el-col :span="6">
            <div class="foot" style="cursor: default">快速入口:</div>
          </el-col>
          <el-col :span="6">
            <div class="foot" @click="jump('/404')">最新校务通知</div>
          </el-col>
          <el-col :span="6">
            <div class="foot" @click="jump('/students')">学生成绩查询</div>
          </el-col>
          <el-col :span="6">
            <div class="foot" @click="jump('/subjects')">教师课程查询</div>
          </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {
      src: [
        'http://s1.wailian.download/2020/07/27/school1.jpg',
        'http://s1.wailian.download/2020/07/27/school2.jpg',
        'http://s1.wailian.download/2020/07/27/school3.jpg'
      ]
    }
  },
  methods: {
    jump(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
      this.$router.push(activePath)
    }
  }
}
</script>

<style lang="less" scoped>
  .title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 6px;
    margin-top: -10px;
    cursor: default;
  }
  .foot {
    font-weight: bold;
    margin-top: -4px;
    text-align: center;
    cursor: pointer;
  }
  .card {
    margin-left: 34px;
    margin-right: 34px;
    margin-top: 10px;
    height: 50px;
  }
</style>
