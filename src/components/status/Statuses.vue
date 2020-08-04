<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>综合数据</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <!--为Echarts准备一块Dom-->
        <el-col :span="12">
          <div id="user" style="width: 600px; height: 292px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="total" style="width: 600px; height: 292px;"></div>
        </el-col>
      </el-row>
      <el-row>
        <div id="hot" style="width: 1200px; height: 292px;"></div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
// eslint-disable-next-line no-unused-vars
import $ from 'jquery'
export default {
  name: 'Statuses',
  data() {
    return {
      userList: []
    }
  },
  created() {
  },
  // DOM初始化完毕后的操作
  async mounted () {
    // 获取日期热力图
    const date = getVirtualData(2020).data
    const current = getVirtualData(2020).current
    // 基于准备好的dom，初始化echarts实例
    const userChart = echarts.init(document.getElementById('user'), 'light')
    const totalChart = echarts.init(document.getElementById('total'), 'light')
    const hotChart = echarts.init(document.getElementById('hot'), 'light')
    userChart.showLoading()
    totalChart.showLoading()
    hotChart.showLoading()
    // 获取用户数据
    const data = [0, 0, 0]
    const { data: usrRes } = await this.$http.get('login/selectAll')
    if (usrRes.code !== 200) {
      return this.$message.error('获取用户列表失败!')
    }
    for (let i = 0; i < usrRes.data.length; i++) {
      if (usrRes.data[i].usrType === '管理员') {
        data[0]++
      } else if (usrRes.data[i].usrType === '教师') {
        data[1]++
      } else {
        data[2]++
      }
    }
    // 绘制图表
    userChart.setOption({
      title: {
        text: '用户规模'
      },
      tooltip: {},
      xAxis: {
        data: ['管理员', '教师', '学生']
      },
      yAxis: {},
      series: [{
        name: '数量',
        type: 'bar',
        data: data
      }]
    })
    // 获取总体数据
    const totalData = [usrRes.data.length, 0, 0, 0]
    const { data: stuRes } = await this.$http.get('student/selectAll')
    if (stuRes.code !== 200) {
      return this.$message.error('获取学生列表失败!')
    } else {
      totalData[1] = stuRes.data.length
    }
    const { data: subRes } = await this.$http.get('subject/selectAll')
    if (stuRes.code !== 200) {
      return this.$message.error('获取课程列表失败!')
    } else {
      totalData[2] = subRes.data.length
    }
    const { data: scoRes } = await this.$http.get('score/selectAll')
    if (scoRes.code !== 200) {
      return this.$message.error('获取成绩列表失败!')
    } else {
      totalData[3] = scoRes.data.length
    }
    // 绘制图表
    totalChart.setOption({
      title: {
        text: '信息总数'
      },
      tooltip: {},
      xAxis: {
        data: ['注册信息', '学生信息', '课程信息', '成绩信息']
      },
      yAxis: {},
      series: [{
        name: '数量',
        type: 'bar',
        data: totalData
      }]
    })
    const option = {
      backgroundColor: '#fff',

      title: {
        top: 30,
        text: '2020项目开发进度 截至' + current,
        subtext: '测试数据',
        left: 'center',
        textStyle: {
          color: '#000000'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '30',
        left: '100',
        data: ['push次数', 'Top 6'],
        textStyle: {
          color: '#000000'
        }
      },
      calendar: [{
        top: 100,
        left: 'center',
        range: ['2020-01-01', '2020-12-31'],
        splitLine: {
          show: true,
          lineStyle: {
            color: '#000',
            width: 4,
            type: 'solid'
          }
        },
        yearLabel: {
          formatter: '{start}',
          textStyle: {
            color: '#000000'
          }
        },
        itemStyle: {
          color: '#323c48',
          borderWidth: 1,
          borderColor: '#111'
        }
      }],
      series: [
        {
          name: 'push次数',
          type: 'scatter',
          coordinateSystem: 'calendar',
          data: date,
          symbolSize: function(val) {
            return val[1]
          },
          itemStyle: {
            color: '#4c5db1'
          }
        },
        {
          name: 'Top 6',
          type: 'effectScatter',
          coordinateSystem: 'calendar',
          data: date.sort(function(a, b) {
            return b[1] - a[1]
          }).slice(0, 6),
          symbolSize: function(val) {
            return val[1]
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          itemStyle: {
            color: '#2e90d1',
            shadowBlur: 10,
            shadowColor: '#333'
          },
          zlevel: 1
        }
      ]
    }
    // 绘制图表
    hotChart.setOption(option)
    // 取消loading
    setTimeout(() => {
      userChart.hideLoading()
      totalChart.hideLoading()
      hotChart.hideLoading()
    }, 500)
    function getVirtualData(year) {
      year = year || '2020'
      const date = +echarts.number.parseDate(year + '-01-01')
      const now = new Date()
      const mon = now.getMonth() + 1
      const month = mon < 10 ? '-0' + mon : '-' + mon
      const currentMonth = mon < 10 ? '0' + mon : '' + mon
      const da = now.getDate()
      const day = da < 10 ? '-0' + da : '-' + da
      console.log(month + day)
      const end = +echarts.number.parseDate(year + month + day)
      const dayTime = 3600 * 24 * 1000
      const data = []
      for (let time = date; time < end; time += dayTime) {
        data.push([
          echarts.format.formatTime('yyyy-MM-dd', time),
          Math.floor(Math.random() * 2) === 0
            ? Math.floor(Math.random() * 15) : 0
        ])
      }
      return { data: data, current: currentMonth + day }
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

</style>
