<template>
  <el-dialog
    title="重新登录账号"
    visible
    width="436px"
    append-to-body
    :close-on-click-modal="false"
    @close="$emit('close')"
  >
    <p class="relogin-tip">
      登录信息已失效，请重新登录账号：
    </p>
    <el-form
      ref="userForm"
      label-position="right"
      label-width="60px"
      :model="userForm"
      :rules="userFormRule"
    >
      <el-form-item
        label="账号"
        prop="account"
      >
        <el-input
          v-model="userForm.account"
          placeholder="请输入账号"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="userForm.password"
          type="password"
          placeholder="请输入密码"
          @keydown.enter.native="submit"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        @click="submit"
      >
        登录
      </el-button>
      <el-button @click="$emit('close')">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import md5 from "js-md5";
import { login } from "@/service";
export default {
  data() {
    return {
      userForm: {
        account: "",
        password: ""
      },
      userFormRule: {
        account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          let params = {
            account: this.userForm.account,
            password: md5(this.userForm.password)
          };
          login(params)
            .then(res => {
              if (res.code == 1) {
                this.$message.success("登录成功，请重新请求页面");
                this.$emit("close");
              } else {
                this.$message.error(res.message);
              }
            })
            .catch(err => {
              this.$message.error(err[0].message);
            });
        }
      });
    }
  }
};
</script>

<style scoped>
.relogin-tip {
  color: #999;
  margin: 24px 24px 0;
}
</style>
