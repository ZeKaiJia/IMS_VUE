<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" @click.native="changeMenu('/')">首页</el-breadcrumb-item>
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
            v-model="queryInfo.usrName"
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
          <el-button type="primary" @click="showAddDialog()"
          >添加用户
          </el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-tooltip
            class="item"
            effect="light"
            placement="right"
            style="margin-top: 10px"
            content="通过锁定用户可以禁用该用户数据的修改和删除操作"
          >
            <el-button style="padding: 0; border-color: white" circle>
              <i class="el-icon-info" style="font-size: 20px"/>
            </el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="8">
          <el-alert
            title="测试时请不要删除或禁用所有管理员账户"
            style="min-width: 360px; max-width: 360px"
            type="warning"
            show-icon>
          </el-alert>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table
        :data="showUsrList"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
        v-loading="loading"
      >
        <!--拓展列-->
        <el-table-column type="expand" label="详细" width="64px" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="3" align="right">
                <el-tag type="info" effect="plain">
                  联系电话
                </el-tag>
              </el-col>
              <el-col :span="10">
                <el-tag type="info" effect="plain">
                  {{scope.row.usrPhone}}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" align="right">
                <el-tag type="info" effect="plain">
                  电子邮箱
                </el-tag>
              </el-col>
              <el-col :span="10">
                <el-tag type="info" effect="plain">
                  {{scope.row.usrEmail}}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" align="right">
                <el-tag type="info" effect="plain">
                  最近登录
                </el-tag>
              </el-col>
              <el-col :span="10">
                <el-tag type="info" effect="plain">
                  {{scope.row.lastLogin}}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" align="right">
                <el-tag type="info" effect="plain">
                  创建时间
                </el-tag>
              </el-col>
              <el-col :span="10">
                <el-tag type="info" effect="plain">
                  {{scope.row.utcCreate}}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" align="right">
                <el-tag type="info" effect="plain">
                  修改时间
                </el-tag>
              </el-col>
              <el-col :span="10">
                <el-tag type="info" effect="plain">
                  {{scope.row.utcModify}}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" align="right">
                <el-tag type="info" effect="plain">
                  修改人
                </el-tag>
              </el-col>
              <el-col :span="10">
                <el-tag type="info" effect="plain">
                  {{scope.row.modifyBy === '' ? '空' : scope.row.modifyBy}}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" align="right">
                <el-tag type="info" effect="plain">
                  备注
                </el-tag>
              </el-col>
              <el-col :span="10">
                <el-tag type="info" effect="plain">
                  {{scope.row.remark === '' ? '空' : scope.row.remark}}
                </el-tag>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column label="序号" width="58px" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+(currentPage - 1) * pageSize + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="usrName" align="center"/>
        <el-table-column label="密码" align="center">
          <template slot-scope="scope">
            <span>{{showPassword ?
              (scope.row.usrName === checkPassUser ? scope.row.usrPassword + ' '  : '******** ')
              : '******** '}}</span>
            <el-button
              icon="el-icon-view"
              type="text"
              @click="checkPassword(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="角色" prop="usrType" align="center"/>
        <el-table-column label="昵称" prop="usrNick" align="center"/>
        <el-table-column label="状态" align="center" width="180px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.valid"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="锁定"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180px">
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
                @click="showEditDialog(scope.row.usrName)"
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
                @click="removeUserByName(scope.row.usrName)"
                round
              />
            </el-tooltip>
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
        label-width="100px"
        v-loading="dialogLoading"
      >
        <el-form-item label="用户名" prop="usrName">
          <el-input v-model="addForm.usrName" />
        </el-form-item>
        <el-form-item label="密码" prop="usrPassword">
          <el-input v-model="addForm.usrPassword" />
        </el-form-item>
        <el-form-item label="昵称" prop="usrNick">
          <el-input v-model="addForm.usrNick" />
        </el-form-item>
        <el-form-item label="角色" prop="usrType">
          <template>
            <el-select v-model="addForm.usrType" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="联系电话" prop="usrPhone">
          <el-input v-model.number="addForm.usrPhone" type="number"/>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="usrEmail">
          <el-input v-model="addForm.usrEmail" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="addForm.remark"
            placeholder="请输入备注"
            maxlength="20"
            show-word-limit
          />
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
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        v-loading="dialogLoading"
      >
        <el-form-item label="用户名" prop="usrName">
          <el-input v-model="editForm.usrName" disabled/>
        </el-form-item>
        <el-form-item label="密码" prop="usrPassword">
          <el-input v-model="editForm.usrPassword" />
        </el-form-item>
        <el-form-item label="昵称" prop="usrNick">
          <el-input v-model="editForm.usrNick" />
        </el-form-item>
        <el-form-item label="角色" prop="usrType">
          <template>
            <el-select v-model="editForm.usrType" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="联系电话" prop="usrPhone">
          <el-input v-model.number="editForm.usrPhone" type="number"/>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="usrEmail">
          <el-input v-model="editForm.usrEmail" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="editForm.remark"
            placeholder="请输入备注"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">修 改</el-button>
      </span>
    </el-dialog>
    <!--回到顶部-->
    <el-backtop target=".el-main" :bottom="50">△</el-backtop>
  </div>
</template>

<script>
import { sliceData, timestampToTime, checkError, easyChangeRoleName } from '../../plugins/utils'
export default {
  name: 'Users',
  data() {
    // 验证邮箱
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的邮箱'))
      }
    }
    // 验证手机号
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的手机号'))
      }
    }
    return {
      // 开启加载
      loading: true,
      dialogLoading: true,
      // 路由url
      routeUrl: '/users',
      // 角色类型选择 TODO
      options: [{
        value: 'admin',
        label: '管理员'
      }, {
        value: 'teacher',
        label: '教师'
      }, {
        value: 'student',
        label: '学生'
      }],
      // 获取密码用户
      checkPassUser: '',
      // 显示密码
      showPassword: false,
      // 页面数据显示条数
      pageSize: 7,
      // 当前页数
      currentPage: 1,
      // 获取用户列表的参数对象
      queryInfo: {
        usrName: ''
      },
      // 读取到的用户数据
      userList: [],
      // 显示在 table 中的数据
      showUsrList: [],
      total: 0,
      // 控制添加用户对话框的显示
      addDialogVisible: false,
      // 控制修改用户对话框的显示
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        usrName: '',
        usrPassword: '',
        usrNick: '',
        usrPhone: '',
        usrEmail: '',
        remark: '',
        modifyBy: '',
        usrType: ''
      },
      // 修改用户的表单数据
      editForm: {
        usrName: '',
        usrPassword: '',
        usrNick: '',
        usrPhone: '',
        usrEmail: '',
        remark: '',
        usrType: '',
        valid: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        usrName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
        ],
        usrPassword: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 14, message: '长度在6到14个字符', trigger: 'blur' }
        ],
        usrNick: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
        ],
        usrPhone: [
          { required: true, message: '请输入用户联系电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        usrEmail: [
          { required: true, message: '请输入用户电子邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        usrType: [
          { required: true, message: '请选择用户角色类型', trigger: 'blur' }
        ]
      },
      editFormRules: {
        usrPassword: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 14, message: '长度在6到14个字符', trigger: 'blur' }
        ],
        usrNick: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
        ],
        usrPhone: [
          { required: true, message: '请输入用户联系电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        usrEmail: [
          { required: true, message: '请输入用户电子邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        usrType: [
          { required: true, message: '请输入用户角色类型', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.information.$emit('activePath', this.routeUrl)
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      this.loading = true
      const { data: res } = await this.$http.get('user/selectAll')
      if (res.code !== 200) {
        this.loading = false
        return this.$message.error('获取用户列表失败!' + checkError(res))
      }
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].usrType = await this.selectEachRole(res.data[i].usrName)
        res.data[i].utcCreate = timestampToTime(res.data[i].utcCreate)
        res.data[i].utcModify = timestampToTime(res.data[i].utcModify)
        res.data[i].lastLogin =
          res.data[i].lastLogin > 31539467000
            ? timestampToTime(res.data[i].lastLogin)
            : '新用户'
      }
      this.userList = res.data
      // 根据当前页数和每页显示数控大小截取数据
      this.showUsrList = sliceData(this.userList, this.currentPage, this.pageSize)
      if (this.showUsrList.length === 0) {
        this.currentPage = this.currentPage - 1
        this.showUsrList = sliceData(this.userList, this.currentPage, this.pageSize)
      }
      this.total = res.data.length
      this.loading = false
    },
    // 获取用户角色
    async selectEachRole (usrName) {
      const { data: res } = await this.$http.get(`role/findRoleDesByUserName?usrName=${usrName}`)
      return res.data
    },
    // 查找用户
    async selectUser() {
      this.loading = true
      const { data: res } = await this.$http.get('user/selectByName', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        this.loading = false
        return this.$message.error('获取用户列表失败!' + checkError(res))
      }
      res.data.usrType = await this.selectEachRole(res.data.usrName)
      this.userList = []
      this.userList.push(res.data)
      this.userList[0].utcCreate = timestampToTime(this.userList[0].utcCreate)
      this.userList[0].utcModify = timestampToTime(this.userList[0].utcModify)
      this.userList[0].lastLogin =
        this.userList[0].lastLogin > 31539467000
          ? timestampToTime(this.userList[0].lastLogin)
          : '新用户'
      // 定向搜索只可能查询到一条记录
      this.showUsrList = this.userList
      this.total = res.data.length
      this.loading = false
    },
    // 查看用户密码
    checkPassword(data) {
      if (this.checkPassUser === data.usrName || this.checkPassUser === '') {
        this.showPassword = !this.showPassword
      }
      if (!this.showPassword && this.checkPassUser !== data.usrName) {
        this.showPassword = true
      }
      this.checkPassUser = data.usrName
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
      if (userInfo.valid === false) {
        const { data: res } = await this.$http.post(
          `user/disable?usrName=${userInfo.usrName}`
        )
        if (res.code !== 200) {
          setTimeout(() => {
            userInfo.valid = true
          }, 1000)
          return this.$message.error('锁定用户失败！' + checkError(res))
        } else {
          return this.$message.success('锁定用户成功！')
        }
      } else {
        const { data: res } = await this.$http.post(
          `user/recover?usrName=${userInfo.usrName}`
        )
        if (res.code !== 200) {
          setTimeout(() => {
            userInfo.valid = false
          }, 1000)
          return this.$message.error('开启用户失败！' + checkError(res))
        } else {
          return this.$message.success('开启用户成功！')
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
        this.dialogLoading = true
        const { data: res } = await this.$http.post(
          `user/insert?usrType=${this.addForm.usrType}`,
          this.addForm
        )
        this.dialogLoading = false
        if (res.code !== 200) {
          this.addDialogVisible = false
          return this.$message.error('添加用户失败' + checkError(res))
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
        if (!valid) return this.$message.error('请填写正确的用户信息后再提交')
        if (!this.editForm.valid) {
          this.editDialogVisible = false
          return this.$message.warning('数据被锁定无法进行操作')
        }
        this.dialogLoading = true
        const { data: res } = await this.$http.post(
          `user/update?usrType=${this.editForm.usrType}`,
          this.editForm
        )
        this.dialogLoading = false
        if (res.code !== 200) {
          this.editDialogVisible = false
          return this.$message.error('修改用户失败' + checkError(res))
        } else {
          this.editDialogVisible = false
          this.$message.success('修改用户成功')
        }
        this.getUserList()
      })
    },
    // 点击按钮删除用户信息
    async removeUserByName(usrName) {
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
      const { data: valid } = await this.$http.get(`user/selectByName?usrName=${usrName}`)
      if (!valid.data.valid) {
        return this.$message.warning('数据被锁定无法进行操作')
      }
      const { data: res } = await this.$http.post(`user/delete?usrName=${usrName}`)
      if (res.code !== 200) {
        return this.$message.error('删除用户失败' + checkError(res))
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    // 监听修改用户对话框的点击事件
    async showEditDialog(usrName) {
      const { data: res } = await this.$http.get(
        `user/selectByName?usrName=${usrName}`
      )
      if (res.code !== 200) {
        return this.$message.error('查询用户信息失败' + checkError(res))
      }
      res.data.usrType = await this.selectEachRole(usrName)
      res.data.usrType = easyChangeRoleName(res.data.usrType)
      this.editForm = res.data
      this.editDialogVisible = true
      this.dialogLoading = false
    },
    showAddDialog () {
      this.addDialogVisible = true
      this.dialogLoading = false
    },
    // 当前页面显示数据条数改变事件
    // eslint-disable-next-line no-dupe-keys,vue/no-dupe-keys
    handleSizeChange (val) {
      this.pageSize = val
      // 根据当前页数和每页显示数控大小截取数据
      this.showUsrList = sliceData(this.userList, this.currentPage, this.pageSize)
    },
    // 页码改变事件
    // eslint-disable-next-line no-dupe-keys,vue/no-dupe-keys
    handleCurrentChange (val) {
      this.currentPage = val
      // 根据当前页数和每页显示数控大小截取数据
      this.showUsrList = sliceData(this.userList, this.currentPage, this.pageSize)
    },
    // 面包屑导航切换
    changeMenu(activePath) {
      this.information.$emit('activePath', activePath)
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
  .el-tag {
    margin-left: 16px;
    margin-top: 6px;
    margin-bottom: 6px;
  }
</style>
