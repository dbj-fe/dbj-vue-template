<template>
  <div class="layout-container">
    <div class="layout-header">
      <div class="layout-header-left">
        <el-button
          type="primary"
          icon="icon-new"
        >
          创建按钮
        </el-button>
        <el-button type="primary">
          主按钮2
        </el-button>
        <el-button>按钮</el-button>
        <el-select
          v-model="select1"
          placeholder="选择框的提示"
        >
          <el-option
            :value="1"
            label="选项1"
          />
          <el-option
            :value="2"
            label="选项2"
          />
        </el-select>
      </div>
      <div class="layout-header-right">
        <dbj-search-input
          v-model="keyword"
          :type.sync="keywordType"
          :types="keywordTypes"
          clearable
          @search="searchPage"
        />
      </div>
    </div>
    <div class="layout-body horizontal">
      <div class="layout-side">
        <div class="layout-side-top">
          <el-button
            type="primary"
            icon="icon-new"
          >
            创建按钮
          </el-button>
          <el-button>其他按钮</el-button>
        </div>
        <div class="layout-side-body">
          <oper-tree
            ref="operTree"
            :data="treeData2"
            :props="treeProps"
            :max-level="3"
            :oper-btns="['addChild', 'rename', 'moveUp', 'moveDown', 'delete']"
            add-child-btn-text="添加子类目"
            @current-change="currentChange"
            @move-up="moveUp"
            @move-down="moveDown"
            @remove="remove"
            @append="append"
            @rename="rename"
          >
            <template
              slot="operBtns"
              slot-scope="{data, node}"
            >
              <li @click="handleTreeNodeOper(data, node)">
                其他操作1
              </li>
              <li
                v-if="node.level == 1"
                @click="handleTreeNodeOper(data, node)"
              >
                只一级有的按钮
              </li>
            </template>
            <template
              slot="operBtns0"
              slot-scope="{data, node}"
            >
              <li @click="handleTreeNodeOper(data, node)">
                有顺序要求的按钮
              </li>
            </template>
            <template
              slot="img"
              slot-scope="{data, node}"
            >
              <img
                v-if="node.isLeaf && node.level > 1"
                src="../../images/no-pic@2x.png"
              >
              <img
                v-else
                src="../../images/folder.png"
              >
            </template>
          </oper-tree>
        </div>
      </div>
      <div class="layout-main">
        <div class="layout-main-header">
          <div class="layout-header-left">
            <el-select
              v-model="isEnabled"
              @change="searchPage"
            >
              <el-option
                label="全部状态"
                :value="-1"
              />
              <el-option
                label="启用"
                :value="1"
              />
              <el-option
                label="停用"
                :value="0"
              />
            </el-select>
          </div>
          <div class="layout-header-right">
            <dbj-search-input
              v-model="keyword"
              placeholder="请输入关键字"
              @search="searchPage"
            />
          </div>
        </div>
        <div class="layout-main-body">
          <el-table
            :data="tableData"
            size="medium"
            height="100%"
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="180"
            />
            <el-table-column
              prop="name"
              label="姓名"
              width="180"
            />
            <el-table-column
              prop="address"
              label="地址"
            />
            <el-pagination
              v-if="pageTotal > pageSize"
              slot="append"
              background
              layout="prev, pager, next, jumper"
              :current-page="pageNum"
              :total="pageTotal"
              :page-size="pageSize"
              @current-change="getPage"
            />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OperTree from "@/components/common/OperTree";
const SEARCH_TYPE_TIP = {
  0: "项目／业主／创建人",
  1: "请输入项目名称",
  2: "请输入业主信息",
  3: "请输入创建人姓名"
};
export default {
  name: "DemoTable",
  components: {
    OperTree
  },
  data() {
    return {
      select1: "",
      keyword: "",
      isEnabled: -1,
      keywordType: -1,
      keywordTypes: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 1,
          label: "业主信息"
        },
        {
          value: 2,
          label: "项目名称"
        },
        {
          value: 3,
          label: "项目编码"
        }
      ],
      treeProps: {
        label: "name",
        children: "list"
      },
      treeData: [],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      pageTotal: 20,
      pageSize: 15,
      pageNum: 1
    };
  },
  computed: {
    switchSearchPlaceholder() {
      return SEARCH_TYPE_TIP[this.keywordType];
    },
    treeData2() {
      return [
        {
          id: -1,
          name: "全部",
          noOper: true
        }
      ].concat(this.treeData);
    }
  },
  mounted() {
    this.requestTreeData();
  },
  methods: {
    searchPage() {},
    getPage() {},
    requestTreeData() {
      setTimeout(() => {
        this.treeData = [
          {
            id: 1,
            name: "分类1",
            list: [
              {
                id: 11,
                name: "分类1——1"
              },
              {
                id: 12,
                name: "分类1——2"
              }
            ]
          },
          {
            id: 2,
            name: "分类2"
          },
          {
            id: 3,
            name: "分类3"
          }
        ];
        this.$refs.operTree.setCurrentKey(-1);
        this.$refs.operTree.expandParents(-1);
      }, 100);
    },
    handleTreeNodeOper(data, node) {
      // eslint-disable-next-line
      console.log(data, node);
    },
    currentChange(data, node) {
      // eslint-disable-next-line
      console.log(data, node);
    },
    moveUp(data, node) {
      // eslint-disable-next-line
      console.log(data, node);
    },
    moveDown(data, node) {
      // eslint-disable-next-line
      console.log(data, node);
    },
    rename(data, node) {
      // eslint-disable-next-line
      console.log(data, node);
    },
    append(data, node) {
      let parent = node.parent;
      let parentId = parent.data.id;
      // eslint-disable-next-line
      console.log(data, node, parentId);
    },
    remove(data, node) {
      // eslint-disable-next-line
      console.log(data, node);
    }
  }
};
</script>
