<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
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
          <el-alert
            title="通过锁定学生可以禁用该学生数据的修改和删除操作"
            style="min-width: 480px; max-width: 480px"
            type="info"
            show-icon>
          </el-alert>
        </el-col>
      </el-row>
      <!--学生列表区域-->
      <el-table :data="stuList" border stripe>
        <!--拓展列-->
        <el-table-column type="expand" label="详细" width="64px" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-tag type="info" effect="plain">
                创建时间
              </el-tag>
              <el-tag type="info" effect="plain">
                {{scope.row.utcCreate}}
              </el-tag>
            </el-row>
            <el-row>
              <el-tag type="info" effect="plain">
                修改时间
              </el-tag>
              <el-tag type="info" effect="plain">
                {{scope.row.utcModify}}
              </el-tag>
            </el-row>
            <el-row>
              <el-tag type="info" effect="plain">
                电子邮箱
              </el-tag>
              <el-tag type="info" effect="plain">
                {{scope.row.stuEmail}}
              </el-tag>
            </el-row>
            <el-row>
              <el-tag type="info" effect="plain">
                出生日期
              </el-tag>
              <el-tag type="info" effect="plain">
                {{scope.row.stuBirthday}}
              </el-tag>
            </el-row>
            <el-row>
              <el-tag type="info" effect="plain">
                年龄
              </el-tag>
              <el-tag type="info" effect="plain">
                {{scope.row.stuAge}}
              </el-tag>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index" label="序号" align="center"/>
        <el-table-column label="学号" prop="stuId" align="center" min-width="100px"/>
        <el-table-column label="姓名" prop="stuName" align="center" min-width="100px"/>
        <el-table-column label="性别" prop="stuGender" align="center"/>
        <el-table-column label="状态" align="center" width="180px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isReal"
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
      <!--显示总条目数量-->
      <el-pagination layout="total" :total="total"> </el-pagination>
    </el-card>
    <!--添加学生的对话框-->
    <el-dialog
      title="添加学生"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!--内容主题区域-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="学号" prop="stuId">
          <el-input v-model="addForm.stuId" oninput="value=value.replace(/[^\d.]/g,'')"/>
        </el-form-item>
        <el-form-item label="姓名" prop="stuName">
          <el-input v-model="addForm.stuName" />
        </el-form-item>
        <el-form-item label="性别" prop="stuGender">
          <el-input v-model="addForm.stuGender" />
        </el-form-item>
        <el-form-item label="生日" prop="stuBirthday">
          <el-input v-model="addForm.stuBirthday" />
        </el-form-item>
        <el-form-item label="邮箱" prop="stuEmail">
          <el-input v-model="addForm.stuEmail" />
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
    >
      <!--内容主题区域-->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="学号" prop="stuId">
          <el-input v-model="editForm.stuId" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="stuName">
          <el-input v-model="editForm.stuName" />
        </el-form-item>
        <el-form-item label="性别" prop="stuGender">
          <el-input v-model="editForm.stuGender" />
        </el-form-item>
        <el-form-item label="生日" prop="stuBirthday">
          <el-input v-model="editForm.stuBirthday" />
        </el-form-item>
        <el-form-item label="邮箱" prop="stuEmail">
          <el-input v-model="editForm.stuEmail" />
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
import { easyChangeGender, easyTimestamp, operateAge, timestampToTime } from '../../plugins/utils'
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
    // 验证日期
    const checkDate = (rule, value, callback) => {
      const regDate = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/
      if (regDate.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的日期格式'))
      }
    }
    return {
      // 搜索信息
      queryInfo: {
        stuId: ''
      },
      stuList: [],
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
        stuAge: ''
      },
      // 修改学生的表单数据
      editForm: {
        stuId: '',
        stuName: '',
        stuGender: '',
        stuBirthday: '',
        stuEmail: '',
        stuAge: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        stuId: [
          { required: true, message: '请输入学生ID,1-2位:入学年份,3-4位:专业号,5-6:班级号,7-8:学号', trigger: 'blur' },
          { min: 8, max: 8, message: '长度为8位阿拉伯数字', trigger: 'blur' }
        ],
        stuName: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度为2到4个中文汉字', trigger: 'blur' }
        ],
        stuGender: [
          { required: true, message: '请输入学生性别', trigger: 'blur' },
          {
            type: 'enum',
            enum: ['男', '女'],
            message: '角色类型必须为男或女',
            trigger: 'blur'
          }
        ],
        stuBirthday: [
          { required: true, message: '请输入学生生日', trigger: 'blur' },
          { validator: checkDate, trigger: 'blur' }
        ],
        stuEmail: [
          { required: true, message: '请输入学生邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      editFormRules: {
        stuName: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度为2到4个中文汉字', trigger: 'blur' }
        ],
        stuGender: [
          { required: true, message: '请输入学生性别', trigger: 'blur' },
          {
            type: 'enum',
            enum: ['男', '女'],
            message: '角色类型必须为男或女',
            trigger: 'blur'
          }
        ],
        stuBirthday: [
          { required: true, message: '请输入学生生日', trigger: 'blur' },
          { validator: checkDate, trigger: 'blur' }
        ],
        stuEmail: [
          { required: true, message: '请输入学生邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getStudentList()
  },
  methods: {
    // 获取学生列表
    async getStudentList() {
      const { data: res } = await this.$http.get('student/selectAdmin')
      if (res.code !== 200) {
        return this.$message.error('获取学生列表失败!')
      }
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].utcCreate = timestampToTime(res.data[i].utcCreate)
        res.data[i].utcModify = timestampToTime(res.data[i].utcModify)
        res.data[i].stuBirthday = easyTimestamp(res.data[i].stuBirthday.valueOf())
        res.data[i].stuGender = easyChangeGender(res.data[i].stuGender)
        res.data[i].stuAge = operateAge(res.data[i].stuBirthday.valueOf())
      }
      this.stuList = res.data
      this.total = res.data.length
    },
    // 查找学生
    async selectStudent() {
      const { data: res } = await this.$http.get('student/selectAdminById', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取学生列表失败!')
      }
      this.stuList = []
      this.stuList.push(res.data)
      this.stuList[0].utcCreate = timestampToTime(this.stuList[0].utcCreate)
      this.stuList[0].utcModify = timestampToTime(this.stuList[0].utcModify)
      this.stuList[0].stuBirthday = easyTimestamp(this.stuList[0].stuBirthday.valueOf())
      this.stuList[0].stuGender = easyChangeGender(this.stuList[0].stuGender)
      this.stuList[0].stuAge = operateAge(this.stuList[0].stuBirthday)
      this.total = res.data.length
    },
    // 监听 switch 开关的改变
    async studentStateChange(studentInfo) {
      if (studentInfo.isReal === false) {
        const { data: res } = await this.$http.post(
          `student/delete?stuId=${studentInfo.stuId}`
        )
        if (res.code !== 200) {
          return this.$message.error('锁定学生失败')
        } else {
          this.getStudentList()
          return this.$message.success('锁定学生成功')
        }
      } else {
        const { data: res } = await this.$http.post(
          `student/reDelete?stuId=${studentInfo.stuId}`
        )
        if (res.code !== 200) {
          return this.$message.error('开启学生失败')
        } else {
          this.getStudentList()
          return this.$message.success('开启学生成功')
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
        `student/selectAdminById?stuId=${stuId}`
      )
      if (res.code !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editForm.stuBirthday = easyTimestamp(this.editForm.stuBirthday.valueOf())
      this.editForm.stuGender = easyChangeGender(this.editForm.stuGender)
      this.editDialogVisible = true
    },
    // 点击按钮添加学生信息
    addStudent() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写正确的学生信息后再提交')
        this.addForm.stuGender = easyChangeGender(this.addForm.stuGender)
        this.addForm.stuAge = operateAge(this.addForm.stuBirthday)
        const { data: res } = await this.$http.post(
          'student/insert',
          this.addForm
        )
        if (res.code !== 200) {
          this.addDialogVisible = false
          return this.$message.error('添加学生失败')
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
        this.editForm.stuGender = easyChangeGender(this.editForm.stuGender)
        this.editForm.stuAge = operateAge(this.editForm.stuBirthday)
        const { data: res } = await this.$http.post(
          'student/update',
          this.editForm
        )
        if (res.code !== 200) {
          this.editDialogVisible = false
          return this.$message.error('修改学生失败')
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
      const { data: res } = await this.$http.post(`student/save?stuId=${stuId}`)
      if (res.code !== 200) {
        return this.$message.error('删除学生失败')
      }
      this.$message.success('删除学生成功')
      this.getStudentList()
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
</style>
