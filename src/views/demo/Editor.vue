<template>
  <div class="form-container">
    <div class="form-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path: '/test'}">
          XX管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>新建XX</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-body">
      <div class="form-section">
        <quill-editor
          ref="textEditor"
          v-model="content"
          :config="editorOpts"
        />
        <dbj-upload
          v-model="imageUrl"
          style="display:none;"
          type="image"
          @error="$message.error"
        >
          <span id="editorUploader" />
        </dbj-upload>
      </div>
      <div class="form-btns-wrapper">
        <el-button
          type="primary"
          @click="save"
        >
          确定
        </el-button>
        <el-button>取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditorDemo",
  data() {
    return {
      content: "",
      imageUrl: "",
      editorOpts: {
        placeholder: "请输入文字",
        theme: "snow"
      }
    };
  },
  mounted() {
    this.$nextTick(this.initEditor);
  },
  methods: {
    initEditor() {
      let editor = this.$refs.textEditor.quill;
      let toolbar = editor.getModule("toolbar");
      toolbar.addHandler("image", () => {
        document.getElementById("editorUploader").click();
      });
    },
    uploadImgSuccess() {
      let editor = this.$refs.textEditor.quill;
      let cursorPos = editor.getSelection().index;
      editor.insertEmbed(cursorPos, "image", this.imageUrl);
      editor.setSelection(cursorPos + 1);
    },
    save() {
      // eslint-disable-next-line
      console.log(this.content, 33333);
    }
  }
};
</script>
