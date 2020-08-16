<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" @click.native="changeMenu('/')">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--添加角色按钮区-->
      <el-row :gutter="10">
        <el-col :span="3">
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
        v-loading="loading"
      >
        <el-table-column type="index" label="#" width="48px" align="center"/>
        <el-table-column label="权限名称" prop="name" align="center" width="148px"/>
        <el-table-column label="权限代码" prop="permission" align="center"/>
        <el-table-column label="路径名称" prop="url" align="center"/>
        <el-table-column label="权限等级" prop="remark" align="center" width="148px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.remark === '0'" type="info">零级</el-tag>
            <el-tag type="success" v-else-if="scope.row.remark === '1'">一级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.remark === '2'">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240px" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >编辑
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              disabled
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--显示分页信息-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[1, 5, 7, 10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--修改权限的对话框-->
    <el-dialog
      title="修改权限"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
      v-loading="dialogLoading"
    >
      <!--内容主题区域-->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="权限名" prop="name">
          <el-input v-model="editForm.name"/>
        </el-form-item>
        <el-form-item label="权限代码" prop="permission">
          <el-input v-model="editForm.permission" disabled/>
        </el-form-item>
        <el-form-item label="权限url" prop="url">
          <el-input v-model="editForm.url" disabled/>
        </el-form-item>
        <el-form-item label="权限等级" prop="remark">
          <el-select v-model="editForm.remark" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPermission">修 改</el-button>
      </span>
    </el-dialog>
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
      // 开启加载
      loading: true,
      dialogLoading: true,
      // 路由url
      routeUrl: '/rights',
      // 权限等级选项
      options: [{
        value: '3',
        label: '管理级别'
      }, {
        value: '2',
        label: '教师级别'
      }, {
        value: '1',
        label: '学生级别'
      }, {
        value: '0',
        label: '匿名级别'
      }],
      // 控制修改用户对话框的显示
      editDialogVisible: false,
      // 页面数据显示条数
      pageSize: 7,
      // 当前页数
      currentPage: 1,
      // 读取到的权限数据
      rightsList: [],
      // 分页显示的权限数据
      showRightsList: [],
      total: 0,
      // 修改权限的表单数据
      editForm: {
        name: '',
        permission: '',
        url: '',
        remark: ''
      },
      // 添加表单的验证规则对象
      editFormRules: {
        name: [
          { required: true, message: '请输入权限名' }
        ],
        remark: [
          { required: true, message: '请选择权限等级' }
        ]
      }
    }
  },
  created() {
    this.information.$emit('activePath', this.routeUrl)
    this.$message.warning('权限暂不支持增删')
    this.getRightList()
  },
  methods: {
    // 获取权限列表
    async getRightList () {
      this.loading = true
      const { data: res } = await this.$http.get('permission/selectAllPermission')
      if (res.code !== 200) {
        this.loading = false
        return this.$message.error('获取权限列表失败!' + checkError(res))
      }
      this.rightsList = res.data
      this.showRightsList = sliceData(this.rightsList, this.currentPage, this.pageSize)
      if (this.showRightsList.length === 0) {
        this.currentPage = this.currentPage - 1
        this.showRightsList = sliceData(this.rightsList, this.currentPage, this.pageSize)
      }
      this.total = res.data.length
      this.loading = false
    },
    // 监听修改权限对话框的点击事件
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `permission/selectById?id=${id}`
      )
      if (res.code !== 200) {
        return this.$message.error('查询权限信息失败' + checkError(res))
      }
      this.editForm = res.data
      this.editDialogVisible = true
      this.dialogLoading = false
    },
    editPermission() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写正确的权限信息后再提交')
        this.dialogLoading = true
        const { data: res } = await this.$http.post(
          'permission/update',
          this.editForm
        )
        this.dialogLoading = false
        if (res.code !== 200) {
          this.editDialogVisible = false
          return this.$message.error('修改权限失败' + checkError(res))
        } else {
          this.editDialogVisible = false
          this.$message.success('修改权限成功')
        }
        this.getRightList()
      })
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
    },
    // 监听添加用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 面包屑导航切换
    changeMenu(activePath) {
      this.information.$emit('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped></style>
