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
              零级权限为公共权限<br/>
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
        :data="showRightsList"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
        stripe
      >
        <el-table-column type="index" label="#" width="48px" align="center"/>
        <el-table-column label="权限名称" prop="name" align="center"/>
        <el-table-column label="路径名称" prop="url" align="center"/>
        <el-table-column label="权限等级" prop="remark" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.remark === '0'" type="info">零级</el-tag>
            <el-tag type="success" v-else-if="scope.row.remark === '1'">一级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.remark === '2'">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240px" align="center">
          <template slot-scope="">
            <el-button type="primary" icon="el-icon-edit" size="mini" disabled>编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" disabled>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--显示分页信息-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 7, 10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--回到顶部-->
    <el-backtop target=".el-main" :bottom="50">△</el-backtop>
  </div>
</template>

<script>
import { checkError, sliceData } from '../../plugins/utils'

export default {
  name: 'Rights',
  data() {
    return {
      // 页面数据显示条数
      pageSize: 7,
      // 当前页数
      currentPage: 1,
      // 读取到的权限数据
      rightsList: [],
      // 分页显示的权限数据
      showRightsList: [],
      total: 0
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    // 获取权限列表
    async getRightList () {
      this.$message.warning('权限暂不支持自定义')
      const { data: res } = await this.$http.get('user/selectAllPermission')
      if (res.code !== 200) {
        return this.$message.error('获取权限列表失败!' + checkError(res))
      }
      this.rightsList = res.data
      this.showRightsList = sliceData(this.rightsList, this.currentPage, this.pageSize)
      this.total = res.data.length
    },
    // 当前页面显示数据条数改变事件
    // eslint-disable-next-line no-dupe-keys,vue/no-dupe-keys
    handleSizeChange(val) {
      this.pageSize = val
      // 根据当前页数和每页显示数控大小截取数据
      this.showRightsList = sliceData(this.rightsList, this.currentPage, this.pageSize)
    },
    // 页码改变事件
    // eslint-disable-next-line no-dupe-keys,vue/no-dupe-keys
    handleCurrentChange(val) {
      this.currentPage = val
      // 根据当前页数和每页显示数控大小截取数据
      this.showRightsList = sliceData(this.rightsList, this.currentPage, this.pageSize)
    }
  }
}
</script>

<style lang="less" scoped></style>
