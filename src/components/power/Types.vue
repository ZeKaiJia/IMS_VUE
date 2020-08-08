<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--添加角色按钮区-->
      <el-row>
        <el-col :span="3">
          <el-button type="primary" disabled>添加角色</el-button>
        </el-col>
        <el-col :span="1">
          <el-tooltip
            class="item"
            effect="light"
            placement="right"
            style="margin-top: 10px"
            content="anno为匿名权限，任何人都可以访问，无需添加">
            <el-button style="padding: 0; border-color: white" circle>
              <i class="el-icon-info" style="font-size: 20px"/>
            </el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="7">
          <el-alert
            title="请不要删除所有管理员权限"
            style="min-width: 280px; max-width: 290px"
            type="error"
            show-icon>
          </el-alert>
        </el-col>
        <el-col :span="8">
          <el-alert
            title="修改完权限后的用户重新登录即可生效"
            style="min-width: 380px; max-width: 390px"
            type="info"
            show-icon>
          </el-alert>
        </el-col>
      </el-row>
      <el-table
        :data="typeList"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
        stripe
      >
        <el-table-column type="index" label="#" width="48px" align="center"/>
        <el-table-column label="名称" prop="role" align="center" width="160px"/>
        <el-table-column label="描述" prop="description" align="center" width="160px"/>
        <el-table-column label="特权" prop="remark" align="center"/>
        <el-table-column label="操作" width="340px" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" disabled>删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showManageDialog(scope.row.role)"
            >分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--修改用户的对话框-->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--内容主题区域-->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="名称" prop="role">
          <el-input v-model="editForm.role" disabled/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description"/>
        </el-form-item>
        <el-form-item label="特权" prop="remark">
          <el-input v-model="editForm.remark"/>
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">修 改</el-button>
      </span>
    </el-dialog>
    <!--分配权限的对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="manageDialogVisible"
      width="65%"
    >
      <div style="text-align: center" class="ddiv">
        <!--穿梭框候选区-->
        <el-transfer
          filterable
          style="text-align: left; display: inline-block"
          v-model="manageValue"
          :data="manageData"
          :titles="['未拥有', '已拥有']"
          :button-texts="['删权限', '加权限']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
        />
      </div>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="manageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="manage">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { checkError } from '../../plugins/utils'

export default {
  name: 'Types',
  data() {
    return {
      // 记录正在操作的角色
      manageRole: '',
      // 分配权限中所有的权限
      manageData: [],
      // 分配权限中已拥有的权限下标
      manageValue: [],
      // 分配权限中已拥有的权限
      managePermission: [],
      // 控制分配权限对话框的显示
      manageDialogVisible: false,
      // 角色列表
      typeList: [],
      // 角色总数
      total: 0,
      // 控制修改用户对话框的显示
      editDialogVisible: false,
      // 修改用户的表单数据
      editForm: {
        description: '',
        role: '',
        remark: ''
      },
      // 添加表单的验证规则对象
      editFormRules: {
        description: { required: true, message: '请输入描述', trigger: 'blur' },
        remark: { required: true, message: '请输入特权', trigger: 'blur' }
      }
    }
  },
  created() {
    this.$message.warning('角色暂不支持添加')
    this.getTypeList()
  },
  methods: {
    // 获取角色列表
    async getTypeList () {
      const { data: res } = await this.$http.get('role/selectAll')
      if (res.code !== 200) {
        return this.$message.error('获取角色列表失败!' + checkError(res))
      }
      this.typeList = res.data
      this.total = res.data.length
    },
    // 监听添加用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听修改角色对话框的点击事件
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `role/selectById?id=${id}`
      )
      if (res.code !== 200) {
        return this.$message.error('查询角色信息失败' + checkError(res))
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击按钮修改角色信息
    editRole() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写正确的角色信息后再提交')
        const { data: res } = await this.$http.post(
          'role/update',
          this.editForm
        )
        if (res.code !== 200) {
          this.editDialogVisible = false
          return this.$message.error('修改角色失败' + checkError(res))
        } else {
          this.editDialogVisible = false
          this.$message.success('修改角色成功')
        }
        this.getTypeList()
      })
    },
    // 监听分配权限对话框的点击事件
    showManageDialog(role) {
      this.manageDialogVisible = true
      this.manageRole = role
      this.generateManage(role)
    },
    // 穿梭框数据初始化
    async generateManage(role) {
      this.manageValue = []
      this.manageData = []
      const { data: enablePermissions } = await this.$http.get(`role/findPermissionByRole?role=${role}`)
      const { data: allPermissions } = await this.$http.get('permission/selectAllPermission')
      if (allPermissions.code !== 200) {
        return this.$message.error('获取权限列表失败!' + checkError(allPermissions))
      }
      this.managePermission = enablePermissions.data
      for (let i = 0; i < allPermissions.data.length; i++) {
        this.manageData.push({
          key: i,
          label: allPermissions.data[i].permission
        })
      }
      this.managePermission.forEach((permission, index) => {
        for (let i = 0; i < this.manageData.length; i++) {
          if (this.manageData[i].label === permission) {
            this.manageValue.push(i)
          }
        }
      })
    },
    // 处理权限的变化
    async manage () {
      let flag = true
      const { data: preRes } = await this.$http.post(
        `permission/preManagePermission?role=${this.manageRole}`
      )
      if (preRes.code !== 200) {
        flag = false
      }
      for (let i = 0; i < this.manageValue.length; i++) {
        const { data: res } = await this.$http.post(
          `permission/managePermission?role=${this.manageRole}&permission=${this.manageData[this.manageValue[i]].label}`
        )
        if (res.code !== 200) {
          flag = false
        }
      }
      if (!flag) {
        this.manageDialogVisible = false
        return this.$message.error('分配权限失败!')
      }
      this.manageDialogVisible = false
      return this.$message.success('分配权限成功!')
    }
  }
}
</script>

<style lang="less" scoped>
  .el-transfer /deep/ .el-transfer-panel {
    width: 270px !important;
    height: 400px;
  }
  .ddiv /deep/ .el-transfer-panel__filter {
    width: 90%;
  }
  .ddiv /deep/ .el-transfer-panel__list.is-filterable {
    height: 75%;
  }
  .ddiv /deep/ .el-transfer-panel__body {
    height: 100%;
  }
</style>
