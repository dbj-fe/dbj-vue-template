<template>
  <el-tabs value="home">
    <el-tab-pane
      key="home"
      label="空页面1"
      name="home"
    >
      <dbj-empty
        title="没有数据"
        tip="请刷新后重试"
      />
    </el-tab-pane>
    <el-tab-pane
      key="impression"
      label="空页面2"
      name="impression"
    >
      <dbj-empty
        v-requested
        title="没有数据"
        tip="有v-requested时，在ajax请求完成后才会显示"
      />
    </el-tab-pane>
    <el-tab-pane
      key="pano"
      label="tab内部可以嵌套表格结构"
      name="pano"
    >
      <demo-table />
    </el-tab-pane>
    <el-tab-pane
      key="build"
      label="tab内部可以嵌套列表结构"
      name="build"
    >
      <demo-list />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import DemoTable from "@/views/demo/Table";
import DemoList from "@/views/demo/List";
export default {
  name: "DemoTabs",
  components: {
    DemoTable,
    DemoList
  },
  data() {
    return {};
  }
};
</script>
