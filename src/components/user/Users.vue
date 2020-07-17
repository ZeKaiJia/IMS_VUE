<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入用户名"
            v-model="queryInfo.usrId"
            @clear="getUserList"
            clearable
          >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="selectUser"
          />
          </el-input>
        </el-col>
        <el-col :span="2.5">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
        <el-col :span="11">
          <el-alert
            title="请勿将所有用户的状态关闭，这将导致用户无法登录系统"
            style="min-width: 500px; max-width: 500px"
            type="warning"
            show-icon>
          </el-alert>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="userList" :row-class-name="tableRowClassName" border>
        <el-table-column type="index" label="序号" width="38px" align="center"/>
        <el-table-column label="用户名" prop="usrId" align="center"/>
        <el-table-column label="密码" prop="usrPassword" align="center"/>
        <el-table-column label="角色" prop="usrType" width="78px" align="center"/>
        <el-table-column label="创建时间" prop="utcCreate" width="190px" align="center"/>
        <el-table-column label="修改时间" prop="utcModify" width="190px" align="center"/>
        <el-table-column label="最近登录时间" prop="lastLogin" width="190px" align="center"/>
        <el-table-column label="状态" width="148px" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isReal"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
              @change="userStateChange(scope.row)"
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
      <!--分页区域-->
      <!--@size-change="handleSizeChange"-->
      <!--@current-change="handleCurrentChange"-->
      <!--:current-page="queryInfo.pageNum"-->
      <!--:page-sizes="[1, 2, 5, 10]"-->
      <!--:page-size="queryInfo.pageSize"-->
      <!--total, sizes, prev, pager, next, jumper-->
      <el-pagination layout="total" :total="total"> </el-pagination>
    </el-card>
    <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!--内容主题区域-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="usrId">
          <el-input v-model="addForm.usrId" />
        </el-form-item>
        <el-form-item label="密码" prop="usrPassword">
          <el-input v-model="addForm.usrPassword" />
        </el-form-item>
        <el-form-item label="角色" prop="usrType">
          <el-input v-model="addForm.usrType" />
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">添 加</el-button>
      </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--内容主题区域-->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="usrId">
          <el-input v-model="editForm.usrId" disabled />
        </el-form-item>
        <el-form-item label="密码" prop="usrPassword">
          <el-input v-model="editForm.usrPassword" />
        </el-form-item>
        <el-form-item label="角色" prop="usrType">
          <el-input v-model="editForm.usrType" />
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { timestampToTime } from '../../plugins/utils'
export default {
  name: 'Users',
  data() {
    // // 验证邮箱
    // var checkEmail = (rule, value, callback) => {
    //   const regEmail = /^([a-zA-z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
    //   if (regEmail.test(value)) {
    //     return callback()
    //   } else {
    //     callback(new Error('请输入合法的邮箱'))
    //   }
    // }
    // // 验证手机号
    // var checkMobile = (rule, value, callback) => {
    //   const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    //   if (regMobile.test(value)) {
    //     return callback()
    //   } else {
    //     callback(new Error('请输入合法的手机号'))
    //   }
    // }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        usrId: ''
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示
      addDialogVisible: false,
      // 控制修改用户对话框的显示
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        usrId: '',
        usrPassword: '',
        usrType: ''
      },
      // 查询用户的表单数据
      editForm: {
        usrId: '',
        usrPassword: '',
        usrType: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        usrId: [
          { required: true, message: '请输入用户ID', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
        ],
        usrPassword: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
        ],
        usrType: [
          { required: true, message: '请输入用户角色类型', trigger: 'blur' },
          {
            type: 'enum',
            enum: ['管理员', '教师', '学生'],
            message: '角色类型必须为管理员、教师或学生',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('login/selectAdmin')
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].utcCreate = timestampToTime(res.data[i].utcCreate)
        res.data[i].utcModify = timestampToTime(res.data[i].utcModify)
        res.data[i].lastLogin =
          res.data[i].lastLogin > 31539467000
            ? timestampToTime(res.data[i].lastLogin)
            : '新用户'
      }
      this.userList = res.data
      this.total = res.data.length
    },
    // 查找用户
    async selectUser() {
      const { data: res } = await this.$http.get('login/selectAdminById', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = []
      this.userList.push(res.data)
      this.userList[0].utcCreate = timestampToTime(this.userList[0].utcCreate)
      this.userList[0].utcModify = timestampToTime(this.userList[0].utcModify)
      this.userList[0].lastLogin =
        this.userList[0].lastLogin > 31539467000
          ? timestampToTime(this.userList[0].lastLogin)
          : '新用户'
      this.total = res.data.length
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听 page 改变的事件
    handleCurrentChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听 switch 开关的改变
    async userStateChange(userInfo) {
      if (userInfo.isReal === false) {
        const { data: res } = await this.$http.post(
          `login/delete?usrId=${userInfo.usrId}`
        )
        if (res.code !== 200) {
          return this.$message.error('禁用用户失败')
        } else {
          this.getUserList()
          return this.$message.success('禁用用户成功')
        }
      } else {
        const { data: res } = await this.$http.post(
          `login/redelete?usrId=${userInfo.usrId}`
        )
        if (res.code !== 200) {
          return this.$message.error('开启用户失败')
        } else {
          this.getUserList()
          return this.$message.success('开启用户成功')
        }
      }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写正确的用户信息后再提交')
        const { data: res } = await this.$http.post(
          'login/insert',
          this.addForm
        )
        if (res.code !== 200) {
          this.addDialogVisible = false
          return this.$message.error('ID已存在，添加用户失败')
        } else {
          this.addDialogVisible = false
          this.$message.success('添加用户成功')
        }
        this.getUserList()
      })
    },
    // 点击按钮修改用户信息
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(this.editForm.usrType)
        if (!valid) return this.$message.error('请填写正确的用户信息后再提交')
        const { data: res } = await this.$http.post(
          'login/update',
          this.editForm
        )
        if (res.code !== 200) {
          this.editDialogVisible = false
          return this.$message.error('修改用户失败')
        } else {
          this.editDialogVisible = false
          this.$message.success('修改用户成功')
          console.log(res)
        }
        this.getUserList()
      })
    },
    // 点击按钮删除用户信息
    async removeUserById(usrId) {
      // 弹框询问
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '⚠️警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      // 取消操作返回cancel字符串
      // 确认操作返回confirm字符串
      if (confirmResult !== 'confirm') {
        return this.$message.info('已撤回删除操作')
      }
      const { data: res } = await this.$http.post(`login/save?usrId=${usrId}`)
      if (res.code !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    // 凸显身份识别
    tableRowClassName({ row, rowIndex }) {
      if (row.usrType === '管理员') {
        return 'admin-row'
      } else if (row.usrType === '学生') {
        return 'stu-row'
      } else if (row.usrType === '教师') {
        return 'tea-row'
      }
      return ''
    },
    // 监听添加用户对话框的点击事件
    async showEditDialog(usrId) {
      const { data: res } = await this.$http.get(
        `login/selectAdminById?usrId=${usrId}`
      )
      if (res.code !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/css/table.css';
.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 116%;
  left: 0;
}
</style>
