<template>
  <div class="layout-container">
    <div class="layout-body horizonal">
      <div class="layout-main">
        <el-button
          type="primary"
          @click="formDialogShow = true"
        >
          表单弹框
        </el-button>
      </div>
    </div>
    <form-dialog
      v-if="formDialogShow"
      @close="formDialogShow = false"
      @submit="formDialogShow = false"
    />
  </div>
</template>
<script>
import FormDialog from "@/components/demo/FormDialog";
export default {
  name: "DemoComps",
  components: { FormDialog },
  data() {
    return {
      formDialogShow: false
    };
  },
  methods: {
    openFormDialog() {}
  }
};
</script>

