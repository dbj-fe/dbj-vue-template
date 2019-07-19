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
        <div class="avatar-content">
          <div class="avatar-wrapper">
            <img
              v-if="userForm.avatar"
              :src="`${userForm.avatar}?x-oss-process=image/resize,m_lfit,h_240,w_240`"
            >
            <img
              v-else
              src="../../../images/person-black@2x.png"
            >
          </div>
          <uploader
            type="image"
            :max-size="4*1024*1024"
            tip="建议使用.jpg、.png、.bmp格式图片，图片不大于4M"
            @success="uploadImgSuccess"
          >
            <a
              class="avatar-btn"
              href="javascript:void(0)"
            >
              <i class="icon-upload" />上传头像</a>
          </uploader>
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
import Uploader from "@/components/common/Uploader";
export default {
  name: "EditUserDataDialog",
  components: { Uploader },
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

<style scoped>
.avatar-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-wrapper {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin-right: 16px;
  background: #fafafa;
}
.avatar-wrapper img {
  display: inline-block;
  max-width: 120px;
  max-height: 120px;
}
.avatar-btn {
  display: inline-block;
  font-weight: normal;
  font-size: 14px;
  color: #333;
}
.avatar-btn:hover {
  color: #ffa800;
}
.avatar-btn:active {
  color: #ff8a00;
}
.avatar-btn i {
  font-size: 20px;
  vertical-align: -2px;
}

.avatar-content >>> .uploader .uploader-tip {
  line-height: 16px;
}
</style>
