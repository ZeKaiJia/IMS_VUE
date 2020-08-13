<template>
  <div class="login-container">
    <div class="back"></div>
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
        <el-form-item class="form-item" prop="usrName">
          <el-input
            class="form-input"
            placeholder="账号"
            v-model="loginForm.usrName"
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        <!--密码-->
        <el-form-item class="form-item" prop="usrPassword">
          <el-input
            show-password
            class="form-input"
            placeholder="密码"
            v-model="loginForm.usrPassword"
            prefix-icon="el-icon-lock"
            type="password"
          />
        </el-form-item>
        <el-form-item class="form-item" prop="verifycode">
          <el-input
            v-model="loginForm.verifycode"
            placeholder="验证码"
            class="identifyinput form-input"
            prefix-icon="el-icon-key"
          />
        </el-form-item>
        <el-form-item>
          <div class="identifybox" style="display: flex; justify-content: center">
            <div @click="refreshCode">
              <s-identify :identifyCode="identifyCode"/>
            </div>
            <el-button @click="refreshCode" type='text' class="textbtn">看不清，换一张</el-button>
          </div>
        </el-form-item>
        <el-form-item class="form-button">
          <el-button type="primary" @click="submitLoginForm" style="margin-right: 18px">登录</el-button>
          <el-button type="info" @click="resetLoginForm" style="margin-left: 18px">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import SIdentify from './util/Identify'
import { checkError } from '../plugins/utils'
export default {
  name: 'login',
  data() {
    // 验证码自定义验证规则
    const validateVerifycode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.identifyCode) {
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        usrName: '',
        usrPassword: '',
        verifycode: ''
      },
      identifyCodes: '1234567890',
      identifyCode: '',
      loginFormRules: {
        usrName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
        ],
        usrPassword: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
        ],
        verifycode: [
          { required: true, trigger: 'blur', validator: validateVerifycode }
        ]
      }
    }
  },
  components: {
    SIdentify
  },
  mounted() {
    // 验证码初始化
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
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
          'user/login',
          this.loginForm
        )
        if (result.code !== 200) {
          return this.$message.error(checkError(result) + '！请重试')
        } else {
          const { data: type } = await this.$http.get(`role/findRoleByUserName?usrName=${result.data.usrName}`)
          window.sessionStorage.setItem('name', result.data.usrName)
          window.sessionStorage.setItem('nick', result.data.usrNick)
          window.sessionStorage.setItem('type', type.data)
          window.sessionStorage.setItem('token', result.data.utcCreate)
          this.$message.success('欢迎您，' + result.data.usrName)
          await this.$router.push({ path: '/home' }, () => {}, () => {})
        }
      })
    },
    // 生成随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 切换验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成四位随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container {
    height: 100%;
    width: 100%;
    position: relative;
  }
  .back {
    background-image: url("http://s1.wailian.download/2020/07/27/school1.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    height: 100%;
    width: 100%;
    position: absolute;
    filter: blur(4px);
    transition: filter 2s;
  }
  .back:hover {
    filter: blur(0px);
  }
  .login-box {
    width: 600px;
    height: 440px;
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
      margin-top: 24px;
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
      margin-top: -12px;
      text-align: center;
    }
  }
    .el-form /deep/ .el-form-item__error {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 110%;
      left: 140px !important;
    }
  .identifybox {
    display: flex;
    justify-content: space-between;
    margin-top:7px;
  }
  .textbtn {
    margin-left: 24px;
    margin-top: -12px;
  }
</style>
