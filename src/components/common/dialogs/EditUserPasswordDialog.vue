<template>
  <el-dialog
    title="修改密码"
    visible
    width="436px"
    :close-on-click-modal="false"
    @close="$emit('close')"
  >
    <el-form
      ref="userForm"
      label-position="right"
      label-width="80px"
      :model="userForm"
      :rules="userFormRule"
    >
      <el-form-item
        label="密码"
        prop="oldPassword"
      >
        <el-input
          v-model="userForm.oldPassword"
          type="password"
          placeholder="请输入原密码"
        />
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="newPassword"
      >
        <el-input
          v-model="userForm.newPassword"
          type="password"
          placeholder="请输入新密码（6-16位，包括字母、数字）"
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="confirmPassword"
      >
        <el-input
          v-model="userForm.confirmPassword"
          type="password"
          placeholder="请确认密码"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        @click="submit"
      >
        确定
      </el-button>
      <el-button @click="$emit('close')">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import md5 from "js-md5";
import { editUserPassword } from "@/service";
export default {
  name: "EditUserPasswordDialog",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error("请输入6~16位密码"));
      } else {
        if (this.userForm.confirmPassword !== "") {
          this.$refs.userForm.validateField("confirmPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        phone: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      userFormRule: {
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.doSubmit();
        }
      });
    },
    doSubmit() {
      let params = {
        oldPassword: this.userForm.oldPassword
          ? md5(this.userForm.oldPassword)
          : "",
        newPassword: this.userForm.newPassword
          ? md5(this.userForm.newPassword)
          : ""
      };
      editUserPassword(params)
        .then(res => {
          if (res.code == 1) {
            this.$emit("submit");
            this.$message.success("修改密码成功！");
          } else {
            this.$message.error(res.message || "修改密码失败！");
          }
        })
        .catch(err => {
          this.$message.error(err[0].message);
        });
    }
  }
};
</script>



