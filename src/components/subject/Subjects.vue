<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入课程号"
            v-model="queryInfo.subId"
            @clear="getSubjectList"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="selectSubject"
            />
          </el-input>
        </el-col>
        <el-col :span="2.5">
          <el-button type="primary" @click="addDialogVisible = true">添加课程</el-button>
        </el-col>
        <el-col :span="11">
          <el-tooltip
            class="item"
            effect="light"
            placement="right"
            style="margin-top: 10px"
            content="通过锁定课程可以禁用该课程数据的修改和删除操作"
          >
            <el-button style="padding: 0; border-color: white" circle>
              <i class="el-icon-info" style="font-size: 20px"/>
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <!--课程列表区域-->
      <el-table
        :data="showSubList"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
        stripe
      >
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
                修改人
              </el-tag>
              <el-tag type="info" effect="plain">
                {{scope.row.modifyBy === '' ? '空' : scope.row.modifyBy}}
              </el-tag>
            </el-row>
            <el-row>
              <el-tag type="info" effect="plain">
                备注
              </el-tag>
              <el-tag type="info" effect="plain">
                {{scope.row.remark === '' ? '空' : scope.row.remark}}
              </el-tag>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" width="58px" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+(currentPage - 1) * pageSize + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程号" prop="subId" align="center"/>
        <el-table-column label="课程名称" prop="subName" align="center" min-width="100px"/>
        <el-table-column label="任课教师" prop="subTeacherId" align="center" min-width="100px"/>
        <el-table-column label="学分" prop="subCredit" align="center"/>
        <el-table-column label="状态" align="center" width="180px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.valid"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="锁定"
              @change="subjectStateChange(scope.row)"
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
                @click="showEditDialog(scope.row.subId)"
                round
              />
            </el-tooltip>
            <el-tooltip
              class="dark"
              effect="dark"
              content="删除课程"
              placement="top"
              :enterable="false"
              :hide-after="2000"
            >
              <!--删除按钮-->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeSubById(scope.row.subId)"
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
        :current-page="currentPage"
        :page-sizes="[1, 5, 7, 10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加课程的对话框-->
    <el-dialog
      title="添加课程"
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
      >
        <el-form-item label="课程号" prop="subId">
          <el-input v-model="addForm.subId" />
        </el-form-item>
        <el-form-item label="课程名称" prop="subName">
          <el-input v-model="addForm.subName" />
        </el-form-item>
        <el-form-item label="任课老师" prop="subTeacherId">
          <el-input v-model="addForm.subTeacherId" />
        </el-form-item>
        <el-form-item label="学分" prop="subCredit">
          <el-input v-model="addForm.subCredit" oninput="value=value.replace(/[^\d.]/g,'')"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark" />
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubject">添 加</el-button>
      </span>
    </el-dialog>
    <!--修改课程的对话框-->
    <el-dialog
      title="修改课程"
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
        <el-form-item label="课程号" prop="subId">
          <el-input v-model="editForm.subId" disabled />
        </el-form-item>
        <el-form-item label="课程名称" prop="subName">
          <el-input v-model="editForm.subName" />
        </el-form-item>
        <el-form-item label="任课老师" prop="subTeacherId">
          <el-input v-model="editForm.subTeacherId" />
        </el-form-item>
        <el-form-item label="学分" prop="subCredit">
          <el-input v-model="editForm.subCredit" oninput="value=value.replace(/[^\d.]/g,'')"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubject">修 改</el-button>
      </span>
    </el-dialog>
    <!--回到顶部-->
    <el-backtop target=".el-main" :bottom="50">△</el-backtop>
  </div>
</template>

<script>
import { checkError, sliceData, timestampToTime } from '../../plugins/utils'
export default {
  name: 'Subjects',
  data() {
    return {
      // 页面数据显示条数
      pageSize: 7,
      // 当前页数
      currentPage: 1,
      // 搜索信息
      queryInfo: {
        subId: ''
      },
      // 读取到的课程数据
      subjectList: [],
      // 显示在 table 中的数据
      showSubList: [],
      // 添加课程的表单数据
      addForm: {
        subId: '',
        subName: '',
        subTeacherId: '',
        subCredit: '',
        remark: '',
        modifyBy: ''
      },
      // 修改课程的表单数据
      editForm: {
        subId: '',
        subName: '',
        subTeacherId: '',
        subCredit: '',
        remark: '',
        valid: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        subId: [
          { required: true, message: '请输入课程号', trigger: 'blur' },
          { min: 3, max: 3, message: '课程号必须为3位数字', trigger: 'blur' }
        ],
        subName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { max: 10, message: '课程名称不得超过10个字符，请填写简称', trigger: 'blur' }
        ],
        subTeacherId: [
          { required: true, message: '请输入教师用户名(ID)', trigger: 'blur' },
          { min: 2, max: 4, message: '长度为2到4个中文汉字', trigger: 'blur' }
        ],
        subCredit: [
          { required: true, message: '请输入数字类型的课程学分', trigger: 'blur' }
        ],
        remark: [
          { max: 10, message: '长度在10个字符以内', trigger: 'blur' }
        ]
      },
      editFormRules: {
        subName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { max: 10, message: '课程名称不得超过10个字符，请填写简称', trigger: 'blur' }
        ],
        subTeacherId: [
          { required: true, message: '请输入教师用户名(ID)', trigger: 'blur' },
          { min: 2, max: 4, message: '长度为2到4个中文汉字', trigger: 'blur' }
        ],
        subCredit: [
          { required: true, message: '请输入数字类型的课程学分', trigger: 'blur' }
        ],
        remark: [
          { max: 10, message: '长度在10个字符以内', trigger: 'blur' }
        ]
      },
      total: 0,
      // 控制添加课程对话框的显示
      addDialogVisible: false,
      // 控制修改课程对话框的显示
      editDialogVisible: false
    }
  },
  created() {
    this.getSubjectList()
  },
  methods: {
    // 获取课程列表
    async getSubjectList() {
      const { data: res } = await this.$http.get('subject/selectAll')
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败!' + checkError(res))
      }
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].utcCreate = timestampToTime(res.data[i].utcCreate)
        res.data[i].utcModify = timestampToTime(res.data[i].utcModify)
      }
      this.subjectList = res.data
      // 根据当前页数和每页显示数控大小截取数据
      this.showSubList = sliceData(this.subjectList, this.currentPage, this.pageSize)
      this.total = res.data.length
    },
    // 查找课程
    async selectSubject() {
      const { data: res } = await this.$http.get('subject/selectById', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取课程列表失败!' + checkError(res))
      }
      this.subjectList = []
      this.subjectList.push(res.data)
      this.subjectList[0].utcCreate = timestampToTime(this.subjectList[0].utcCreate)
      this.subjectList[0].utcModify = timestampToTime(this.subjectList[0].utcModify)
      // 定向搜索只可能查询到一条记录
      this.showSubList = this.subjectList
      this.total = res.data.length
    },
    // 监听 switch 开关的改变
    async subjectStateChange(subjectInfo) {
      if (subjectInfo.valid === false) {
        const { data: res } = await this.$http.post(
          `subject/disable?subId=${subjectInfo.subId}`
        )
        if (res.code !== 200) {
          setTimeout(() => {
            subjectInfo.valid = true
          }, 1000)
          return this.$message.error('锁定课程失败！' + checkError(res))
        } else {
          return this.$message.success('锁定课程成功！')
        }
      } else {
        const { data: res } = await this.$http.post(
          `subject/recover?subId=${subjectInfo.subId}`
        )
        if (res.code !== 200) {
          setTimeout(() => {
            subjectInfo.valid = false
          }, 1000)
          return this.$message.error('开启课程失败！' + checkError(res))
        } else {
          return this.$message.success('开启课程成功！')
        }
      }
    },
    // 监听添加课程对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听修改课程对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听修改课程对话框的点击事件
    async showEditDialog(subId) {
      const { data: res } = await this.$http.get(
        `subject/selectById?subId=${subId}`
      )
      if (res.code !== 200) {
        return this.$message.error('查询课程信息失败' + checkError(res))
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击按钮添加课程信息
    addSubject() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写正确的课程信息后再提交')
        const { data: res } = await this.$http.post(
          'subject/insert',
          this.addForm
        )
        if (res.code !== 200) {
          this.addDialogVisible = false
          return this.$message.error('添加课程失败' + checkError(res))
        } else {
          this.addDialogVisible = false
          this.$message.success('添加课程成功')
        }
        this.getSubjectList()
      })
    },
    // 点击按钮修改课程信息
    editSubject() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写正确的课程信息后再提交')
        if (!this.editForm.valid) {
          this.editDialogVisible = false
          return this.$message.warning('数据被锁定无法进行操作')
        }
        const { data: res } = await this.$http.post(
          'subject/update',
          this.editForm
        )
        if (res.code !== 200) {
          this.editDialogVisible = false
          return this.$message.error('修改课程失败' + checkError(res))
        } else {
          this.editDialogVisible = false
          this.$message.success('修改课程成功')
        }
        this.getSubjectList()
      })
    },
    // 点击按钮删除课程信息
    async removeSubById(subId) {
      // 弹框询问
      const confirmResult = await this.$confirm(
        '此操作将永久删除该课程, 是否继续?',
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
      const { data: valid } = await this.$http.get(`subject/selectById?subId=${subId}`)
      if (!valid.data.valid) {
        return this.$message.warning('数据被锁定无法进行操作')
      }
      const { data: res } = await this.$http.post(`subject/delete?subId=${subId}`)
      if (res.code !== 200) {
        return this.$message.error('删除课程失败！' + checkError(res))
      }
      this.$message.success('删除课程成功')
      this.getSubjectList()
    },
    // 当前页面显示数据条数改变事件
    // eslint-disable-next-line no-dupe-keys,vue/no-dupe-keys
    handleSizeChange(val) {
      this.pageSize = val
      // 根据当前页数和每页显示数控大小截取数据
      this.showSubList = sliceData(this.subjectList, this.currentPage, this.pageSize)
    },
    // 页码改变事件
    // eslint-disable-next-line no-dupe-keys,vue/no-dupe-keys
    handleCurrentChange(val) {
      this.currentPage = val
      // 根据当前页数和每页显示数控大小截取数据
      this.showSubList = sliceData(this.subjectList, this.currentPage, this.pageSize)
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
