<template>
  <div class="form-container">
    <div class="form-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path: '/test'}">XX管理</el-breadcrumb-item>
        <el-breadcrumb-item>新建XX</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-body">
      <div class="form-section">
        <quill-editor ref="textEditor" v-model="content" :config="editorOpts">
        </quill-editor>
        <uploader style="display:none;" type="image" @success="uploadImgSuccess">
          <span id="editorUploader"></span>
        </uploader>
      </div>
      <div class="form-btns-wrapper">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button>取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Uploader from "@/components/common/Uploader";
export default {
  name: "EditorDemo",
  components: { Uploader },
  data() {
    return {
      content: "",
      editorOpts: {
        placeholder: "请输入文字",
        theme: "snow"
      }
    };
  },
  methods: {
    initEditor() {
      let editor = this.$refs.textEditor.quill;
      let toolbar = editor.getModule("toolbar");
      toolbar.addHandler("image", () => {
        document.getElementById("editorUploader").click();
      });
    },
    uploadImgSuccess(serverUrl, fileKey, size) {
      let editor = this.$refs.textEditor.quill;
      let cursorPos = editor.getSelection().index;
      let url = serverUrl + fileKey;
      editor.insertEmbed(cursorPos, "image", url);
      editor.setSelection(cursorPos + 1);
    },
    save() {
      console.log(this.content, 33333);
    }
  },
  mounted() {
    this.$nextTick(this.initEditor);
  }
};
</script>
