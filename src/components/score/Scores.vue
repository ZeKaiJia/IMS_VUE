<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
      <el-breadcrumb-item>成绩列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form v-model="queryInfo" label-width="12px">
            <el-row>
              <el-col :span="10">
                <el-form-item prop="stuId">
                  <el-input
                    v-model="queryInfo.stuId"
                    placeholder="请输入学号"
                    @clear="getScoreList"
                    clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item prop="subId">
                  <el-input
                    v-model="queryInfo.subId"
                    placeholder="请输入课程号"
                    @clear="getScoreList"
                    clearable>
                    <el-button
                      slot="append"
                      icon="el-icon-search"
                      @click="selectSubject"
                    />
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="2.5">
          <el-button type="primary" @click="addDialogVisible = true">添加成绩</el-button>
        </el-col>
        <el-col :span="11">
          <el-alert
            title="只输入学号或课程号可以搜索所有相关数据"
            style="min-width: 400px; max-width: 420px"
            type="info"
            show-icon>
          </el-alert>
        </el-col>
      </el-row>
      <!--课程列表区域-->
      <el-table :data="scoreList" border>
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
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index" label="序号" width="58px" align="center"/>
        <el-table-column label="学号" prop="stuId" align="center" min-width="100px"/>
        <el-table-column label="课程号" prop="subId" align="center"/>
        <el-table-column label="分数" prop="subScore" align="center"/>
        <el-table-column label="状态" align="center" width="180px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isReal"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="锁定"
              @change="scoreStateChange(scope.row)"
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
                @click="showEditDialog(scope.row)"
                round
              />
            </el-tooltip>
            <el-tooltip
              class="dark"
              effect="dark"
              content="删除成绩"
              placement="top"
              :enterable="false"
              :hide-after="2000"
            >
              <!--删除按钮-->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeScoById(scope.row)"
                round
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--显示总条目数量-->
      <el-pagination layout="total" :total="total"> </el-pagination>
    </el-card>
    <!--添加课程的对话框-->
    <el-dialog
      title="添加成绩"
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
        <el-form-item label="学号" prop="stuId">
          <el-input v-model="addForm.stuId" oninput="value=value.replace(/[^\d.]/g,'')"/>
        </el-form-item>
        <el-form-item label="课程号" prop="subId">
          <el-input v-model="addForm.subId" oninput="value=value.replace(/[^\d.]/g,'')"/>
        </el-form-item>
        <el-form-item label="成绩" prop="subScore">
          <el-input v-model="addForm.subScore" oninput="value=value.replace(/[^\d.]/g,'')"/>
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addScore">添 加</el-button>
      </span>
    </el-dialog>
    <!--修改课程的对话框-->
    <el-dialog
      title="修改成绩"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--内容主题区域-->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="学号" prop="stuId">
          <el-input v-model="editForm.stuId" disabled/>
        </el-form-item>
        <el-form-item label="课程号" prop="subId">
          <el-input v-model="editForm.subId" disabled/>
        </el-form-item>
        <el-form-item label="成绩" prop="subScore">
          <el-input v-model="editForm.subScore" oninput="value=value.replace(/[^\d.]/g,'')"/>
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editScore">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { timestampToTime } from '../../plugins/utils'
export default {
  name: 'Scores',
  data() {
    // 验证分数
    const checkScore = (rule, value, callback) => {
      if (value >= 0 && value <= 100) {
        return callback()
      } else {
        callback(new Error('请输入合法的成绩'))
      }
    }
    return {
      // 搜索信息
      queryInfo: {
        stuId: '',
        subId: ''
      },
      scoreList: [],
      // 添加课程的表单数据
      addForm: {
        stuId: '',
        subId: '',
        subScore: ''
      },
      // 修改课程的表单数据
      editForm: {
        stuId: '',
        subId: '',
        subScore: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        stuId: [
          { required: true, message: '请输入学生ID,1-2位:入学年份,3-4位:专业号,5-6:班级号,7-8:学号', trigger: 'blur' },
          { min: 8, max: 8, message: '长度为8位阿拉伯数字', trigger: 'blur' }
        ],
        subId: [
          { required: true, message: '请输入课程号', trigger: 'blur' },
          { min: 3, max: 3, message: '课程号必须为3位数字', trigger: 'blur' }
        ],
        subScore: [
          { required: true, message: '请输入成绩', trigger: 'blur' },
          { validator: checkScore, trigger: 'blur' }
        ]
      },
      editFormRules: {
        subScore: [
          { required: true, message: '请输入成绩', trigger: 'blur' },
          { validator: checkScore, trigger: 'blur' }
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
    this.getScoreList()
  },
  methods: {
    // 获取成绩列表
    async getScoreList () {
      const { data: res } = await this.$http.get('score/selectAdmin')
      if (res.code !== 200) {
        return this.$message.error('获取成绩列表失败!')
      }
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].utcCreate = timestampToTime(res.data[i].utcCreate)
        res.data[i].utcModify = timestampToTime(res.data[i].utcModify)
      }
      this.scoreList = res.data
      this.total = res.data.length
    },
    // 查找成绩
    async selectSubject() {
      if (this.queryInfo.stuId !== '' && this.queryInfo.subId !== '') {
        const { data: res } = await this.$http.get('score/selectAdminById', {
          params: this.queryInfo
        })
        if (res.code !== 200) {
          return this.$message.error('获取成绩列表失败!')
        }
        this.scoreList = []
        this.scoreList.push(res.data)
        this.scoreList[0].utcCreate = timestampToTime(this.scoreList[0].utcCreate)
        this.scoreList[0].utcModify = timestampToTime(this.scoreList[0].utcModify)
        this.total = res.data.length
      } else if (this.queryInfo.stuId === '' && this.queryInfo.subId !== '') {
        const { data: res } = await this.$http.get(
          `score/selectAdminBySubId?subId=${this.queryInfo.subId}`
        )
        if (res.code !== 200) {
          return this.$message.error('获取成绩列表失败!')
        }
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].utcCreate = timestampToTime(res.data[i].utcCreate)
          res.data[i].utcModify = timestampToTime(res.data[i].utcModify)
        }
        this.scoreList = res.data
        this.total = res.data.length
      } else if (this.queryInfo.stuId !== '' && this.queryInfo.subId === '') {
        const { data: res } = await this.$http.get(
          `score/selectAdminByStuId?stuId=${this.queryInfo.stuId}`
        )
        if (res.code !== 200) {
          return this.$message.error('获取成绩列表失败!')
        }
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].utcCreate = timestampToTime(res.data[i].utcCreate)
          res.data[i].utcModify = timestampToTime(res.data[i].utcModify)
        }
        this.scoreList = res.data
        this.total = res.data.length
      } else {
        return this.$message.error('请输入数据后再查询!')
      }
    },
    // 监听 switch 开关的改变
    async scoreStateChange(scoreInfo) {
      if (scoreInfo.isReal === false) {
        const { data: res } = await this.$http.post(
          `score/delete?stuId=${scoreInfo.stuId}&subId=${scoreInfo.subId}`
        )
        if (res.code !== 200) {
          return this.$message.error('锁定成绩失败')
        } else {
          this.getScoreList()
          return this.$message.success('锁定成绩成功')
        }
      } else {
        const { data: res } = await this.$http.post(
          `score/reDelete?stuId=${scoreInfo.stuId}&subId=${scoreInfo.subId}`
        )
        if (res.code !== 200) {
          return this.$message.error('开启成绩失败')
        } else {
          this.getScoreList()
          return this.$message.success('开启成绩成功')
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
    // 监听修改成绩对话框的点击事件
    async showEditDialog(scope) {
      const { data: res } = await this.$http.get(
        `score/selectAdminById?stuId=${scope.stuId}&subId=${scope.subId}`
      )
      if (res.code !== 200) {
        return this.$message.error('查询成绩信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击按钮添加成绩信息
    addScore() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写正确的成绩信息后再提交')
        const { data: res } = await this.$http.post(
          'score/insert',
          this.addForm
        )
        if (res.code !== 200) {
          this.addDialogVisible = false
          return this.$message.error('添加成绩失败')
        } else {
          this.addDialogVisible = false
          this.$message.success('添加成绩成功')
        }
        this.getScoreList()
      })
    },
    // 点击按钮修改成绩信息
    editScore() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写正确的成绩信息后再提交')
        const { data: res } = await this.$http.post(
          'score/update',
          this.editForm
        )
        if (res.code !== 200) {
          this.editDialogVisible = false
          return this.$message.error('修改成绩失败')
        } else {
          this.editDialogVisible = false
          this.$message.success('修改成绩成功')
        }
        this.getScoreList()
      })
    },
    // 点击按钮删除成绩信息
    async removeScoById(scope) {
      // 弹框询问
      const confirmResult = await this.$confirm(
        '此操作将永久删除该成绩, 是否继续?',
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
      const { data: res } = await this.$http.post(`score/save?stuId=${scope.stuId}&subId=${scope.subId}`)
      if (res.code !== 200) {
        return this.$message.error('删除成绩失败')
      }
      this.$message.success('删除成绩成功')
      this.getScoreList()
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
.el-row .el-col .el-form-item {
  margin-bottom: 0;
}
</style>
