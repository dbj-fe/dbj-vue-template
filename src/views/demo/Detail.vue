<template>
  <div class="detail-container">
    <div class="detail-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path: prevPath}">XX管理</el-breadcrumb-item>
        <el-breadcrumb-item>XX详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-info">
      <h2>王田家项目方案</h2>
      <ul class="detail-info-list horizonal">
        <li>套餐：699套餐</li>
        <li>设计师：杨森 </li>
        <li>房龄：新房</li>
      </ul>
      <ul class="detail-info-list">
        <li>创建时间：2018-03-19 10:11:27</li>
        <li>最后修改时间：2018-03-19 10:11:27</li>
      </ul>
      <div class="detail-info-btns">
        <el-button>编辑</el-button>
        <el-button>删除</el-button>
      </div>
    </div>
    <div class="detail-body">
      <demo-table></demo-table>
    </div>
  </div>
</template>

<script>
import DemoTable from "./Table";
export default {
  name: "DemoDetail",
  components: { DemoTable },
  data() {
    return {
      prevPath: ""
    };
  },
  mounted() {
    if (this.$route.path.indexOf("listDetail")) {
      this.prevPath = "/demo/list";
    } else {
      this.prevPath = "/test";
    }
  }
};
</script>
