<template>
  <div class="layout-container">
    <div class="layout-header">
      <div class="layout-header-left">
        <el-select v-model="query.select1">
          <el-option
            :value="1"
            label="选项1"
          ></el-option>
          <el-option
            :value="2"
            label="选项2"
          ></el-option>
          <el-option
            :value="3"
            label="选项3"
          ></el-option>
        </el-select>
      </div>
      <div class="layout-header-right">
        <el-input
          class="search-input"
          placeholder="请输入姓名／电话／职务"
          v-model="query.keyword"
          clearable
          @keydown.enter.native="searchPage"
        >
          <el-button
            slot="append"
            @click="searchPage"
            icon="icon-search"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="layout-body">
      <div class="list-wrapper">
        <div
          v-for="item in listData"
          :key="item.id"
          class="list-item"
        >
          <div class="list-item-pic">
            <pic
              :src="item.img"
              :width="160"
              :height="160"
            ></pic>
          </div>
          <div class="list-item-info">
            <div class="list-item-title">{{item.name}}</div>
            <ul class="detail-info-list horizonal">
              <li>信息1：{{item.info1}}</li>
              <li>信息2：{{item.info2}}</li>
              <li>信息2：{{item.info2}}</li>
            </ul>
            <ul class="detail-info-list">
              <li>信息1：{{item.info1}}</li>
              <li>信息2：{{item.info2}}</li>
            </ul>
          </div>
          <div class="list-item-oper">
            <a
              href="javascript:void(0);"
              @click="gotoDetail(item.id)"
            >查看</a>
            <a href="javascript:void(0);">编辑</a>
            <a href="javascript:void(0);">删除</a>
          </div>
        </div>
        <el-pagination
          v-if="query.pageTotal > query.pageSize"
          background
          layout="prev, pager, next, jumper"
          :current-page="query.pageNum"
          :total="query.pageTotal"
          :page-size="query.pageSize"
          @current-change="getPage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pic from "@/components/common/Pic";
import queryMixin from "@/utils/queryMixin";
export default {
  name: "DemoList",
  mixins: [queryMixin],
  components: { Pic },
  data() {
    return {
      query: {
        pageNum: 1,
        pageTotal: 20,
        pageSize: 15,
        select1: "",
        keyword: ""
      },
      listData: [
        {
          id: 1,
          img:
            "http://test.ali.image.dabanjia.com/image/20181022/MATERIAL_1540203992009_2386.jpg",
          name: "名字",
          info1: "信息1",
          info2: "信息2"
        },
        {
          id: 2,
          img:
            "http://test.ali.image.dabanjia.com/image/20181022/MATERIAL_1540203992009_2386.jpg",
          name: "名字",
          info1: "信息1",
          info2: "信息2"
        },
        {
          id: 3,
          img: "",
          name: "名字",
          info1: "信息1",
          info2: "信息2"
        },
        {
          id: 4,
          img:
            "http://test.ali.image.dabanjia.com/image/20181022/MATERIAL_1540203992009_2386.jpg",
          name: "名字",
          info1: "信息1",
          info2: "信息2"
        },
        {
          id: 5,
          img:
            "http://test.ali.image.dabanjia.com/image/20181022/MATERIAL_1540203992009_2386.jpg",
          name: "名字",
          info1: "信息1",
          info2: "信息2"
        },
        {
          id: 6,
          img:
            "http://test.ali.image.dabanjia.com/image/20181022/MATERIAL_1540203992009_2386.jpg",
          name: "名字",
          info1: "信息1",
          info2: "信息2"
        }
      ]
    };
  },
  methods: {
    searchPage() {},
    getPage(page) {
      console.log(page);
      this.query.pageNum = page;
    },
    gotoDetail(id) {
      this.$router.push({ path: `/demo/listDetail/${id}` });
    }
  },
  mounted() {
    console.log(this.query.pageNum, 8888);
  }
};
</script>
