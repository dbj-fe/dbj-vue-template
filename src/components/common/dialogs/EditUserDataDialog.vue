<template>
  <el-dialog
    title="修改资料"
    visible
    width="400px"
    :close-on-click-modal="false"
    @close="$emit('close')"
  >
    <el-form
      ref="userForm"
      label-position="right"
      label-width="60px"
      :model="userForm"
      :rules="userFormRule"
      class="edit-user-form"
    >
      <el-form-item
        label="姓名"
        prop="name"
      >
        <el-input
          v-model.trim="userForm.name"
          placeholder="请输入20字内的姓名"
        />
      </el-form-item>
      <el-form-item
        label="头像"
        prop="avatar"
      >
        <div>
          <dbj-upload-image
            v-model="userForm.avatar"
            :max-size="4*1024*1024"
            file-type="jpg,png,bmp"
            btn-text="头像"
            tip="建议使用.jpg、.png、.bmp格式图片，图片不大于4M"
            @error="msg => $message.error(msg)"
          />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        @click="submit"
      >
        确认
      </el-button>
      <el-button @click="$emit('close')">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editUserData } from "@/service";
export default {
  name: "EditUserDataDialog",
  props: ["name", "avatar"],
  data() {
    return {
      userForm: {
        name: "",
        avatar: ""
      },
      userFormRule: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 20, message: "长度在20个字以内", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.userForm.name = this.name;
    this.userForm.avatar = this.avatar;
  },
  methods: {
    uploadImgSuccess(serverUrl, fileKey, size) {
      this.userForm.avatar = serverUrl + fileKey;
    },
    submit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          editUserData({
            name: this.userForm.name,
            avatar: this.userForm.avatar
          }).then(res => {
            if (res.code == 1) {
              this.$emit("submit");
              this.$message.success("修改资料成功！");
            } else {
              this.$message.error("修改资料失败！");
            }
          });
        }
      });
    }
  }
};
</script>

