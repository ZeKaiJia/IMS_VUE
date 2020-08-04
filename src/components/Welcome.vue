<template>
  <div>
    <el-row type="flex" justify="center">
      <span class="title">浙江理工大学科技与艺术学院</span>
    </el-row>
    <el-row type="flex" justify="center">
      <el-carousel :interval="4000" arrow="always" height="560px" style="width: 1150px">
        <el-carousel-item
          v-for="item in src"
          :key="item"
          v-loading="loading"
        >
          <el-image
            :src="item"
            style="height: 580px"
            fit="cover"
            @load="loadSuccess"
            @error="loadError"
          >
            <div slot="error" class="image-slot"
                 style="display: flex; justify-content: center; align-items: center;
                 height: 100%; width: 1150px; flex-flow: column">
              <span class="el-icon-picture-outline" style="width: 48px; height: 48px; font-size: 48px"/>
              <span style="margin-top: 12px">加载失败</span>
            </div>
          </el-image>
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
        'http://s1.wailian.download/2020/07/27/school2.jpg',
        'http://s1.wailian.download/2020/07/27/school3.jpg',
        'http://s1.wailian.download/2020/07/27/school1.jpg'
      ],
      loading: true
    }
  },
  created() {
    window.sessionStorage.setItem('activePath', '/welcome')
    this.$parent.activePath = '/welcome'
  },
  methods: {
    jump(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.$parent.activePath = activePath
      this.$router.push(activePath)
    },
    // 图片加载成功
    loadSuccess() {
      this.loading = false
    },
    // 图片加载失败
    loadError() {
      this.loading = false
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
