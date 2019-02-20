<template>
  <el-tabs value="home">
    <el-tab-pane label="选项1" name="home" key="home">
      <empty-tip title="没有数据" tip="请刷新后重试"></empty-tip>
    </el-tab-pane>
    <el-tab-pane label="选项2" name="impression" key="impression">
      <empty-tip title="没有数据">
        <el-button slot="append" icon="icon-new" type="primary">创建数据</el-button>
      </empty-tip>
    </el-tab-pane>
    <el-tab-pane label="选项3" name="pano" key="pano">
      <demo-table></demo-table>
    </el-tab-pane>
    <el-tab-pane label="选项4" name="build" key="build">
      <demo-list></demo-list>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import EmptyTip from "@/components/common/EmptyTip";
import DemoTable from "@/views/demo/Table";
import DemoList from "@/views/demo/List";
export default {
  name: "DemoTabs",
  components: {
    EmptyTip,
    DemoTable,
    DemoList
  },
  data() {
    return {};
  }
};
</script>
