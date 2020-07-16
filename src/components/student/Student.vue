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
      </el-row>
      <!--学生列表区域-->
      <el-table :data="stuList" border stripe>
        <!--拓展列-->
        <el-table-column type="expand" label="详细" width="64px" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-tag
                type="info"
                effect="plain">
                出生日期
              </el-tag>
              <el-tag
                type="info"
                effect="plain">
                {{scope.row.stuBirthday}}
              </el-tag>
            </el-row>
            <el-row>
              <el-tag
                type="info"
                effect="plain">
                电子邮箱
              </el-tag>
              <el-tag
                type="info"
                effect="plain">
                {{scope.row.stuEmail}}
              </el-tag>
            </el-row>
            <el-row>
              <el-tag
                type="info"
                effect="plain">
                年龄
              </el-tag>
              <el-tag
                type="info"
                effect="plain">
                {{scope.row.stuAge}}
              </el-tag>
            </el-row>
            <el-row>
              <el-tag
                type="info"
                effect="plain">
                更多信息等待添加
              </el-tag>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index" label="序号" width="64px" align="center"/>
        <el-table-column label="学号" prop="stuId" align="center"/>
        <el-table-column label="姓名" prop="stuName" align="center"/>
        <el-table-column label="性别" prop="stuGender" width="64px" align="center"/>
        <el-table-column label="创建时间" prop="utcCreate" width="190px" align="center"/>
        <el-table-column label="修改时间" prop="utcModify" width="190px" align="center"/>
        <el-table-column label="状态" width="148px" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isReal"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
              @change="studentStateChange(scope.row)"
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
    </el-card>
    <!--修改用户的对话框-->
    <el-dialog
      title="修改学生"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--内容主题区域-->
      <el-form
        :model="editForm"
        :rules="addFormRules"
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
  </div>
</template>

<script>
import { easyChangeGender, easyTimestamp, timestampToTime } from '../../plugins/utils'
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
      queryInfo: {
        stuId: ''
      },
      stuList: [],
      total: 0,
      // 控制添加学生对话框的显示
      addDialogVisible: false,
      // 控制修改学生对话框的显示
      editDialogVisible: false,
      // 查询学生的表单数据
      editForm: {
        stuId: '',
        stuName: '',
        stuGender: '',
        stuBirthday: '',
        stuEmail: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        stuId: [
          { required: true, message: '请输入学生ID,1-2位:入学年份,3-4位:专业号,5-6:班级号,7-8:学号', trigger: 'blur' }
        ],
        stuName: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在2到4个中文汉字', trigger: 'blur' }
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
      this.total = res.data.length
    },
    // 监听 switch 开关的改变
    async studentStateChange(studentInfo) {
      if (studentInfo.isReal === false) {
        const { data: res } = await this.$http.post(
          `student/delete?stuId=${studentInfo.stuId}`
        )
        if (res.code !== 200) {
          return this.$message.error('禁用学生失败')
        } else {
          this.getStudentList()
          return this.$message.success('禁用学生成功')
        }
      } else {
        const { data: res } = await this.$http.post(
          `student/redelete?stuId=${studentInfo.stuId}`
        )
        if (res.code !== 200) {
          return this.$message.error('开启学生失败')
        } else {
          this.getStudentList()
          return this.$message.success('开启学生成功')
        }
      }
    },
    // 监听添加用户对话框的关闭事件
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
    // 点击按钮修改用户信息
    editStudent() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写正确的学生信息后再提交')
        this.editForm.stuGender = easyChangeGender(this.editForm.stuGender)
        const { data: res } = await this.$http.post(
          'student/update',
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
        this.getStudentList()
      })
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
