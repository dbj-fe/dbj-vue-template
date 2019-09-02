<template>
  <div class="login-page">
    <div class="login-main">
      <div class="login-logo-wrapper">
        <img
          class="login-logo"
          src="./images/logo-vr@2x.png"
        >
        <div class="login-title">
          企业后台
        </div>
      </div>
      <div class="line" />
      <div class="login-form-wrapper">
        <div class="login-form-title">
          登录
        </div>
        <transition name="el-zoom-in-center">
          <div
            v-show="errorCode > 0"
            class="login-error-tip"
          >
            <i class="icon-clean" />{{ errorMsg }}
          </div>
        </transition>
        <div class="login-input-wrapper">
          <input
            v-model="account"
            placeholder="请输入手机号码"
            @blur="validateAccount"
            @keyup.enter="login"
          >
          <i class="icon-person" />
        </div>
        <div class="login-input-wrapper">
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            @blur="validatePassword"
            @keyup.enter="login"
          >
          <i class="icon-login-password" />
        </div>
        <div
          class="forget-password"
          @click="forgetPassword"
        >
          忘记密码
        </div>
        <el-button
          v-if="!loading"
          class="login-btn"
          type="primary"
          @click="login"
        >
          登录
        </el-button>
        <el-button
          v-else
          class="login-btn"
          type="primary"
        >
          正在登录...
        </el-button>
      </div>
    </div>
    <div class="login-bg1" />
    <div class="login-bg2" />
  </div>
</template>

<script>
import md5 from "js-md5";
import { login } from "./service";
import ENV from "@/ENV";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      account: "",
      password: "",
      errorCode: 0,
      returnMsg: ""
    };
  },
  computed: {
    errorMsg() {
      if (this.errorCode === 4) {
        return this.returnMsg;
      }
      const ERROR_MSG = {
        1: "请输入手机号",
        2: "请输入密码",
        3: "请输入正确的手机号"
      };
      return ERROR_MSG[this.errorCode];
    }
  },
  methods: {
    validateAccount() {
      if (this.errorCode === 1 && this.account) {
        this.errorCode = 0;
      }
      if (this.account && !/^1\d{10}$/.test(this.account)) {
        this.errorCode = 3;
      } else {
        this.errorCode = 0;
      }
    },
    validatePassword() {
      if (this.errorCode === 2 && this.password) {
        this.errorCode = 0;
      }
    },
    validateForm() {
      if (!this.account) {
        this.errorCode = 1;
        return false;
      }
      if (!this.password) {
        this.errorCode = 2;
        return false;
      }
      if (!/^1\d{10}$/.test(this.account)) {
        this.errorCode = 3;
        return false;
      }
      return true;
    },
    login() {
      if (this.validateForm()) {
        this.loading = true;
        login({
          account: this.account,
          password: md5(this.password)
        })
          .then(res => {
            if (res.code == 1) {
              window.location.reload();
            } else {
              this.loading = false;
              this.errorCode = 4;
              this.returnMsg = res.message;
            }
          })
          .catch(err => {
            this.loading = false;
            this.errorCode = 4;
            this.returnMsg = err[0].message;
          });
      }
    },
    //忘记密码
    forgetPassword() {
      window.open(`${ENV.PASSWORD_DOMAIN}/passwordReset.html`);
    }
  }
};
</script>


<style scoped>
.login-page {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  background-size: cover;
  background-image: url("images/bg-login.svg");
}

.login-main,
.login-bg1,
.login-bg2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  height: 460px;
  border-radius: 16px;
}

.login-main {
  z-index: 100;
  width: 720px;
  height: 460px;
  background-image: url("images/bg-login-little.svg");
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.login-bg1 {
  z-index: 99;
  margin-top: 12px;
  width: 680px;
  background: #222;
  background: linear-gradient(90deg, #2a2a2b, #1c1c1f); /* 标准的语法 */
  box-shadow: 0 14px 10px 0 rgba(0, 0, 0, 0.2);
}

.login-bg2 {
  z-index: 98;
  margin-top: 24px;
  width: 640px;
  background: #222;
  background: linear-gradient(90deg, #2a2a2b, #1c1c1f); /* 标准的语法 */
  box-shadow: 0 14px 10px 0 rgba(0, 0, 0, 0.2);
}

.line {
  width: 1px;
  height: 300px;
  background: #474747;
}

.login-logo-wrapper,
.login-form-wrapper {
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.login-logo {
  width: 100px;
  height: 100px;
}

.login-title {
  font-size: 20px;
  color: #ccc;
  margin-top: 40px;
}

.login-form-title {
  font-size: 20px;
  color: #ccc;
  margin-bottom: 40px;
}

.login-error-tip {
  width: 250px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #ff5a5a;
  font-size: 12px;
  color: #ff5a5a;
  margin-bottom: 20px;
}

.login-error-tip i {
  font-size: 20px;
  vertical-align: -4px;
  margin: 0 12px 0 24px;
}

.login-input-wrapper {
  position: relative;
}

.login-input-wrapper input {
  width: 250px;
  height: 44px;
  margin-bottom: 20px;
  padding: 0 8px 0 54px;
  background: #27272a;
  color: #ccc;
  outline: none;
  border: none;
}

.login-input-wrapper input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #666;
}
.login-input-wrapper input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #666;
}
.login-input-wrapper input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #666;
}
.login-input-wrapper input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #666;
}

.login-input-wrapper i {
  position: absolute;
  top: 8px;
  left: 17px;
  color: #666;
  z-index: 10;
  font-size: 28px;
  transition: all 0.3s ease;
}

.login-input-wrapper input:focus + i {
  color: #ccc;
}

.login-btn {
  width: 250px;
  height: 44px;
  margin-top: 20px;
}
.forget-password {
  font-size: 12px;
  color: #ffa800;
  cursor: pointer;
  margin-right: -200px;
}
</style>

