<template>
  <el-dialog title="表单弹框" visible width="436px" :close-on-click-modal="false" @close="$emit('close')">
    <el-form ref="form" label-position="right" label-width="80px" :model="formData" :rules="formRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入20字内名称" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入编码" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="formData.isEnabled">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预览图">
        <uploader type="image" tip="建议使用320*240的.jpg、.png、.bmp格式图片，图片不大于1M"></uploader>
      </el-form-item>
      <el-form-item label="说明" prop="remarks">
        <el-input type="textarea" placeholder="请输入说明" v-model="formData.remarks" :rows="4" resize="none">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Uploader from "@/components/common/Uploader";
export default {
  name: "FormDialog",
  components: { Uploader },
  data() {
    return {
      formData: {
        id: 0,
        name: "",
        code: "",
        isEnabled: 1,
        remarks: ""
      },
      formRules: {
        name: [
          { required: true, message: "请输入工艺名称", trigger: "blur" },
          { max: 20, message: "长度在20个字以内", trigger: "blur" }
        ],
        code: [
          {
            required: false,
            max: 20,
            message: "长度在20个字以内",
            trigger: "blur"
          }
        ],
        remarks: [
          {
            required: false,
            max: 140,
            message: "长度在140个字以内",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid, error) => {
        if (valid) {
          //提交数据
          this.$emit("submit");
        }
      });
    }
  }
};
</script>
