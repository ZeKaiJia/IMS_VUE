<template>
  <div class="login-container">
    <div class="login-box">
      <!--头像区域-->
      <div class="avater-box">
        <img src="../assets/img/avater.png" alt="" />
      </div>
      <!--标题-->
      <div class="login-title">
        <span>综合信息管理系统</span>
      </div>
      <!--登录表单区-->
      <el-form
        label-width="0px"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!--用户名-->
        <el-form-item class="form-item" prop="usrId">
          <el-input
            class="form-input"
            placeholder="账号"
            v-model="loginForm.usrId"
            prefix-icon="iconfont icon-icon-test35"
          />
        </el-form-item>
        <!--密码-->
        <el-form-item class="form-item" prop="usrPassword">
          <el-input
            class="form-input"
            placeholder="密码"
            v-model="loginForm.usrPassword"
            prefix-icon="iconfont icon-icon-test26"
            type="password"
          />
        </el-form-item>
        <el-form-item class="form-button">
          <el-button type="primary" @click="submitLoginForm">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        usrId: '',
        usrPassword: ''
      },
      loginFormRules: {
        usrId: [
          { required: true, message: '请输入用户ID', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到5个字符', trigger: 'blur' }
        ],
        usrPassword: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到5个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    submitLoginForm() {
      // BUG
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('出错啦，再试一次')
        // eslint-disable-next-line
        const { data: result } = await this.$http.post(
          'login/login',
          this.loginForm
        )
        if (result.code !== 200) {
          return this.$message.error('用户名或密码错误，请重试')
        } else {
          await this.$router.push('/home')
          window.sessionStorage.setItem('token', result.data.utcCreate)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}

.login-box {
  width: 600px;
  height: 360px;
  background-color: rgb(191, 212, 243);
  border-radius: 15px;
  position: absolute;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);

  .avater-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 6px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -80%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login-title {
    color: black;
    margin-top: 36px;
    font-size: 40px;
    font-weight: 200;
    text-align: center;
    span {
      border-bottom: 1.5px solid rgb(252, 114, 89);
    }
  }

  .form-item {
    margin-top: 40px;
    text-align: center;
    .form-input {
      border: 0;
      background: none;
      outline: 0;
      transition: 0.2s;
      width: 320px;
    }
  }

  .form-button {
    margin-top: 30px;
    text-align: center;
  }
}
</style>
