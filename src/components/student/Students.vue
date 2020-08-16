<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" @click.native="changeMenu('/')">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入学号"
            v-model="queryInfo.stuId"
            @clear="getStudentList"
            clearable
          >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="selectStudent"
          />
          </el-input>
        </el-col>
        <el-col :span="2.5">
          <el-button type="primary" @click="addDialogVisible = true"
          >添加学生</el-button
          >
        </el-col>
        <el-col :span="11">
          <el-tooltip
            class="item"
            effect="light"
            placement="right"
            style="margin-top: 10px"
            content="通过锁定学生可以禁用该学生数据的修改和删除操作"
          >
            <el-button style="padding: 0; border-color: white" circle>
              <i class="el-icon-info" style="font-size: 20px"/>
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <!--学生列表区域-->
      <el-table
        :data="showStuList"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
        stripe
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
                  {{scope.row.stuPhone}}
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
                  {{scope.row.stuEmail}}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" align="right">
                <el-tag type="info" effect="plain">
                  出生日期
                </el-tag>
              </el-col>
              <el-col :span="10">
                <el-tag type="info" effect="plain">
                  {{scope.row.stuBirthday}}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" align="right">
                <el-tag type="info" effect="plain">
                  年龄
                </el-tag>
              </el-col>
              <el-col :span="10">
                <el-tag type="info" effect="plain">
                  {{scope.row.stuAge}}
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
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+(currentPage - 1) * pageSize + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="学号" prop="stuId" align="center" min-width="100px"/>
        <el-table-column label="姓名" prop="stuName" align="center" min-width="100px"/>
        <el-table-column label="性别" prop="stuGender" align="center"/>
        <el-table-column label="状态" align="center" width="180px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.valid"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="锁定"
              @change="studentStateChange(scope.row)"
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
                @click="showEditDialog(scope.row.stuId)"
                round
              />
            </el-tooltip>
            <el-tooltip
              class="dark"
              effect="dark"
              content="删除学生"
              placement="top"
              :enterable="false"
              :hide-after="2000"
            >
              <!--删除按钮-->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeStuById(scope.row.stuId)"
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
    <!--添加学生的对话框-->
    <el-dialog
      title="添加学生"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      v-loading="dialogLoading"
    >
      <!--内容主题区域-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="学号" prop="stuId">
          <el-input v-model="addForm.stuId"/>
        </el-form-item>
        <el-form-item label="姓名" prop="stuName">
          <el-input v-model="addForm.stuName" />
        </el-form-item>
        <el-form-item label="性别" prop="stuGender">
          <el-select v-model="addForm.stuGender" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="stuBirthday">
          <el-date-picker
            v-model="addForm.stuBirthday"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="邮箱" prop="stuEmail">
          <el-input v-model="addForm.stuEmail" />
        </el-form-item>
        <el-form-item label="手机号" prop="stuPhone">
          <el-input v-model.number="addForm.stuPhone" type="number"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark" >
          <el-input
            v-model="addForm.remark"
            maxlength="20"
            placeholder="请输入备注"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStudent">添 加</el-button>
      </span>
    </el-dialog>
    <!--修改学生的对话框-->
    <el-dialog
      title="修改学生"
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
        label-width="80px"
      >
        <el-form-item label="学号" prop="stuId">
          <el-input v-model="editForm.stuId" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="stuName">
          <el-input v-model="editForm.stuName" />
        </el-form-item>
        <el-form-item label="性别" prop="stuGender">
          <el-select v-model="editForm.stuGender" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="stuBirthday">
          <el-date-picker
            v-model="editForm.stuBirthday"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="邮箱" prop="stuEmail">
          <el-input v-model="editForm.stuEmail" />
        </el-form-item>
        <el-form-item label="手机号" prop="stuPhone">
          <el-input v-model.number="editForm.stuPhone" type="number"/>
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
        <el-button type="primary" @click="editStudent">修 改</el-button>
      </span>
    </el-dialog>
    <!--回到顶部-->
    <el-backtop target=".el-main" :bottom="50">△</el-backtop>
  </div>
</template>

<script>
import {
  sliceData,
  easyChangeGender,
  easyTimestamp,
  operateAge,
  timestampToTime,
  checkError
} from '../../plugins/utils'
export default {
  name: 'Student',
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
    var checkMobile = (rule, value, callback) => {
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
      routeUrl: '/students',
      // 性别选择
      options: [{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
      }],
      // 页面数据显示条数
      pageSize: 7,
      // 当前页数
      currentPage: 1,
      // 搜索信息
      queryInfo: {
        stuId: ''
      },
      // 读取到的学生数据
      studentList: [],
      // 显示在 table 中的数据
      showStuList: [],
      total: 0,
      // 控制添加学生对话框的显示
      addDialogVisible: false,
      // 控制修改学生对话框的显示
      editDialogVisible: false,
      // 添加学生的表单数据
      addForm: {
        stuId: '',
        stuName: '',
        stuGender: '',
        stuBirthday: '',
        stuEmail: '',
        stuPhone: '',
        remark: '',
        modifyBy: ''
      },
      // 修改学生的表单数据
      editForm: {
        stuId: '',
        stuName: '',
        stuGender: '',
        stuBirthday: '',
        stuEmail: '',
        stuPhone: '',
        remark: '',
        valid: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        stuId: [
          { required: true, message: '请输入学号，系别+入学年份+专业号+班级号+学号', trigger: 'blur' },
          { min: 8, max: 10, message: '长度为8到10个字符', trigger: 'blur' }
        ],
        stuName: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度为2到4个中文汉字', trigger: 'blur' }
        ],
        stuGender: [
          { required: true, message: '请选择学生性别', trigger: 'blur' }
        ],
        stuBirthday: [
          { required: true, message: '请选择学生生日', trigger: 'blur' }
        ],
        stuEmail: [
          { required: true, message: '请输入学生邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        stuPhone: [
          { required: true, message: '请输入用户联系电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules: {
        stuName: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度为2到4个中文汉字', trigger: 'blur' }
        ],
        stuGender: [
          { required: true, message: '请输入学生性别', trigger: 'blur' }
        ],
        stuBirthday: [
          { required: true, message: '请输入学生生日', trigger: 'blur' }
        ],
        stuEmail: [
          { required: true, message: '请输入学生邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        stuPhone: [
          { required: true, message: '请输入用户联系电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.information.$emit('activePath', this.routeUrl)
    this.getStudentList()
  },
  methods: {
    // 获取学生列表
    async getStudentList() {
      this.loading = true
      const { data: res } = await this.$http.get('student/selectAll')
      if (res.code !== 200) {
        this.loading = false
        return this.$message.error('获取学生列表失败!' + checkError(res))
      }
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].utcCreate = timestampToTime(res.data[i].utcCreate)
        res.data[i].utcModify = timestampToTime(res.data[i].utcModify)
        res.data[i].stuBirthday = easyTimestamp(res.data[i].stuBirthday.valueOf())
        res.data[i].stuGender = easyChangeGender(res.data[i].stuGender)
        res.data[i].stuAge = operateAge(res.data[i].stuBirthday.valueOf())
      }
      this.studentList = res.data
      // 根据当前页数和每页显示数控大小截取数据
      this.showStuList = sliceData(this.studentList, this.currentPage, this.pageSize)
      if (this.showStuList.length === 0) {
        this.currentPage = this.currentPage - 1
        this.showStuList = sliceData(this.studentList, this.currentPage, this.pageSize)
      }
      this.total = res.data.length
      this.loading = false
    },
    // 查找学生
    async selectStudent() {
      this.loading = true
      const { data: res } = await this.$http.get('student/selectById', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        this.loading = false
        return this.$message.error('获取学生列表失败!' + checkError(res))
      }
      this.studentList = []
      this.studentList.push(res.data)
      this.studentList[0].utcCreate = timestampToTime(this.studentList[0].utcCreate)
      this.studentList[0].utcModify = timestampToTime(this.studentList[0].utcModify)
      this.studentList[0].stuBirthday = easyTimestamp(this.studentList[0].stuBirthday.valueOf())
      this.studentList[0].stuGender = easyChangeGender(this.studentList[0].stuGender)
      this.studentList[0].stuAge = operateAge(this.studentList[0].stuBirthday)
      // 定向搜索只可能查询到一条记录
      this.showStuList = this.studentList
      this.total = res.data.length
      this.loading = false
    },
    // 监听 switch 开关的改变
    async studentStateChange(studentInfo) {
      if (studentInfo.valid === false) {
        const { data: res } = await this.$http.post(
          `student/disable?stuId=${studentInfo.stuId}`
        )
        if (res.code !== 200) {
          setTimeout(() => {
            studentInfo.valid = true
          }, 1000)
          return this.$message.error('锁定学生失败！' + checkError(res))
        } else {
          return this.$message.success('锁定学生成功！')
        }
      } else {
        const { data: res } = await this.$http.post(
          `student/recover?stuId=${studentInfo.stuId}`
        )
        if (res.code !== 200) {
          setTimeout(() => {
            studentInfo.valid = false
          }, 1000)
          return this.$message.error('开启学生失败！' + checkError(res))
        } else {
          return this.$message.success('开启学生成功！')
        }
      }
    },
    // 监听添加学生对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听修改学生对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听添加用户对话框的点击事件
    async showEditDialog(stuId) {
      const { data: res } = await this.$http.get(
        `student/selectById?stuId=${stuId}`
      )
      if (res.code !== 200) {
        return this.$message.error('查询用户信息失败' + checkError(res))
      }
      this.editForm = res.data
      this.editForm.stuBirthday = easyTimestamp(this.editForm.stuBirthday)
      this.editForm.stuGender = easyChangeGender(this.editForm.stuGender)
      this.editDialogVisible = true
      this.dialogLoading = false
    },
    // 点击按钮添加学生信息
    addStudent() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写正确的学生信息后再提交')
        this.dialogLoading = true
        this.addForm.stuGender = easyChangeGender(this.addForm.stuGender)
        this.addForm.stuBirthday = easyTimestamp(this.addForm.stuBirthday)
        const { data: res } = await this.$http.post(
          'student/insert',
          this.addForm
        )
        this.dialogLoading = false
        if (res.code !== 200) {
          this.addDialogVisible = false
          return this.$message.error('添加学生失败' + checkError(res))
        } else {
          this.addDialogVisible = false
          this.$message.success('添加学生成功')
        }
        this.getStudentList()
      })
    },
    // 点击按钮修改学生信息
    editStudent() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写正确的学生信息后再提交')
        if (!this.editForm.valid) {
          this.editDialogVisible = false
          return this.$message.warning('数据被锁定无法进行操作')
        }
        this.dialogLoading = true
        this.editForm.stuGender = easyChangeGender(this.editForm.stuGender)
        this.editForm.stuBirthday = easyTimestamp(this.editForm.stuBirthday)
        const { data: res } = await this.$http.post(
          'student/update',
          this.editForm
        )
        this.dialogLoading = false
        if (res.code !== 200) {
          this.editDialogVisible = false
          return this.$message.error('修改学生失败' + checkError(res))
        } else {
          this.editDialogVisible = false
          this.$message.success('修改学生成功')
        }
        this.getStudentList()
      })
    },
    // 点击按钮删除学生信息
    async removeStuById(stuId) {
      // 弹框询问
      const confirmResult = await this.$confirm(
        '此操作将永久删除该学生, 是否继续?',
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
      const { data: valid } = await this.$http.get(`student/selectById?stuId=${stuId}`)
      if (!valid.data.valid) {
        return this.$message.warning('数据被锁定无法进行操作')
      }
      const { data: res } = await this.$http.post(`student/delete?stuId=${stuId}`)
      if (res.code !== 200) {
        return this.$message.error('删除学生失败' + checkError(res))
      }
      this.$message.success('删除学生成功')
      this.getStudentList()
    },
    // 当前页面显示数据条数改变事件
    // eslint-disable-next-line no-dupe-keys,vue/no-dupe-keys
    handleSizeChange(val) {
      this.pageSize = val
      // 根据当前页数和每页显示数控大小截取数据
      this.showStuList = sliceData(this.studentList, this.currentPage, this.pageSize)
    },
    // 页码改变事件
    // eslint-disable-next-line no-dupe-keys,vue/no-dupe-keys
    handleCurrentChange(val) {
      this.currentPage = val
      // 根据当前页数和每页显示数控大小截取数据
      this.showStuList = sliceData(this.studentList, this.currentPage, this.pageSize)
    },
    // 面包屑导航切换
    changeMenu(activePath) {
      this.information.$emit('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin-left: 16px;
    margin-top: 6px;
    margin-bottom: 6px;
  }
  /*.el-form-item .el-form-item__content .el-input {*/
  /*  width: 80%;*/
  /*}*/
</style>
