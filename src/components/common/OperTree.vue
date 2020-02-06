<template>
  <el-tree
    ref="opertree"
    class="opertree"
    :data="treeData"
    :props="props"
    node-key="id"
    :default-expanded-keys="expandKey"
    :expand-on-click-node="false"
    highlight-current
    @current-change="currentChange"
    @node-click="handleNodeClick"
  >
    <div
      slot-scope="{data: nodeData, node}"
      class="opertree-node"
      :class="getNodeClasses(nodeData, node)"
    >
      <div class="opertree-node-label">
        <slot
          v-if="!noImg && $scopedSlots.img"
          name="img"
          :data="nodeData"
          :node="node"
        />
        <img
          v-else-if="!noImg"
          src="@/images/folder.png"
        >
        <p
          v-if="!nodeData.isEditing"
          @dblclick="() => beforeRename(nodeData, node)"
        >
          <span :title="node.label">{{ node.label }}</span>
        </p>
        <el-input
          v-else
          :ref="`input-${nodeData.id}`"
          v-model="nodeData[labelKey]"
          :maxlength="20"
          @blur="() => updateNode(nodeData, node, false)"
          @keydown.enter.native="() => updateNode(nodeData, node, true)"
        />
      </div>
      <div
        v-if="!noOper && (nodeData.noOper !== true) && !nodeData.isEditing"
        class="opertree-node-oper"
      >
        <slot
          name="operIcon"
          :data="nodeData"
          :node="node"
        />
        <el-popover
          placement="bottom-end"
          :offset="5"
          width="110"
          trigger="hover"
          :visible-arrow="false"
        >
          <div
            slot="reference"
            class="opertree-btn"
          >
            <i class="icon-more" />
          </div>
          <ul class="opertree-opts">
            <slot
              name="operBtns0"
              :data="nodeData"
              :node="node"
            />
            <li
              v-if="opBtns.indexOf('addChild') >= 0"
              v-show="node.level < maxLev"
              @click="() => beforeAppend(nodeData, node)"
            >
              {{ addChildBtnText || "添加子分类" }}
            </li>
            <slot
              name="operBtns1"
              :data="nodeData"
              :node="node"
            />
            <li
              v-if="opBtns.indexOf('rename') >= 0"
              @click="() => beforeRename(nodeData, node)"
            >
              重命名
            </li>
            <slot
              name="operBtns2"
              :data="nodeData"
              :node="node"
            />
            <li
              v-if="opBtns.indexOf('moveUp') >= 0"
              v-show="moveUpShow(nodeData, node)"
              @click="() => $emit('move-up', nodeData, node)"
            >
              上移
            </li>
            <li
              v-if="opBtns.indexOf('moveDown') >= 0"
              v-show="moveDownShow(nodeData, node)"
              @click="() => $emit('move-down', nodeData, node)"
            >
              下移
            </li>
            <slot
              name="operBtns3"
              :data="nodeData"
              :node="node"
            />
            <li
              v-if="opBtns.indexOf('delete') >= 0"
              @click="() => $emit('remove', nodeData, node)"
            >
              删除
            </li>
            <slot
              name="operBtns"
              :data="nodeData"
              :node="node"
            />
          </ul>
        </el-popover>
      </div>
    </div>
  </el-tree>
</template>

<script>
const NEW_NODE_ID = -10;
export default {
  name: "OperTree",
  props: [
    "data",
    "props",
    "operBtns",
    "addChildBtnText",
    "maxLevel",
    "noImg",
    "nodeClassName"
  ],
  data() {
    return {
      inputOrginalValue: "",
      isEnterUpdate: false,
      currentNodeKey: -1,
      expandKey: [-1]
    };
  },
  computed: {
    childrenKey() {
      return this.props["children"] || "children";
    },
    labelKey() {
      return this.props["label"] || "label";
    },
    treeData() {
      return this.data.concat([]);
    },
    maxLev() {
      return this.maxLevel || 3;
    },
    opBtns() {
      return this.operBtns || [];
    },
    noOper() {
      return (
        !this.opBtns.length &&
        !this.$scopedSlots.operBtns &&
        !this.$scopedSlots.operIcon
      );
    }
  },
  methods: {
    /** 在根节点添加一个节点，只有一个根节点的时候使用 */
    appendRoot() {
      const newChild = {
        id: NEW_NODE_ID,
        isEditing: true,
        [this.labelKey]: "",
        [this.childrenKey]: []
      };
      this.expandKey = [-1];
      this.$refs.opertree.append(newChild, -1);
      setTimeout(() => {
        this.$refs[`input-${newChild.id}`].focus();
      }, 50);
    },
    /** 添加一级节点，有多个一级节点的时候使用 */
    addFirstLevelChild() {
      const newChild = {
        id: NEW_NODE_ID,
        isEditing: true,
        [this.labelKey]: "",
        [this.childrenKey]: []
      };
      if (this.treeData.length) {
        let key = this.data[this.treeData.length - 1].id;
        this.$refs.opertree.insertAfter(newChild, key);
      } else {
        this.$refs.opertree.append(newChild);
      }
      setTimeout(() => {
        this.$refs[`input-${newChild.id}`].focus();
      }, 50);
    },
    beforeAppend(data, node) {
      const newChild = {
        id: NEW_NODE_ID,
        isEditing: true,
        [this.labelKey]: "",
        [this.childrenKey]: []
      };
      node.expand();
      this.$refs.opertree.append(newChild, data);
      setTimeout(() => {
        this.$refs[`input-${newChild.id}`].focus();
      }, 50);
    },
    beforeRename(data, node) {
      if (this.noOper || data.noOper || this.opBtns.indexOf("rename") < 0) {
        return;
      }
      this.inputOrginalValue = node.label;
      this.$set(data, "isEditing", true);
      this.$nextTick(() => {
        this.$refs[`input-${data.id}`].focus();
      });
    },
    rename(data, node, success) {
      if (success) {
        this.$set(data, "isEditing", false);
      } else {
        this.$set(data, this.labelKey, this.inputOrginalValue);
        this.$set(data, "isEditing", false);
      }
    },
    updateNode(data, node, isEnterUpdate) {
      //输入框中按下Enter键的时候屏蔽blur事件再次调用
      if (isEnterUpdate) {
        this.isEnterUpdate = true;
      } else {
        if (this.isEnterUpdate) {
          this.isEnterUpdate = false;
          return;
        }
        this.isEnterUpdate = false;
      }
      //添加节点的情况
      if (data.id == NEW_NODE_ID) {
        if (data[this.labelKey]) {
          this.$emit("append", data, node);
        } else {
          this.$refs.opertree.remove(data);
        }
      } else {
        if (
          data[this.labelKey] &&
          data[this.labelKey] != this.inputOrginalValue
        ) {
          this.$emit("rename", data, node);
        } else {
          this.$set(data, this.labelKey, this.inputOrginalValue);
          this.$set(data, "isEditing", false);
        }
      }
    },
    moveUpShow(data, node) {
      if (data.noMoveUp) {
        return false;
      }
      const parent = node.parent;
      const children = parent.data[this.childrenKey] || parent.data;
      if (children.length <= 1) {
        return false;
      }
      const index = children.findIndex(d => d.id === data.id);
      //“全部”和“未分类”等没有操作，下面的不应该能往上移动
      if (index > 0) {
        return !children[index - 1].noOper;
      }
      return false;
    },
    moveDownShow(data, node) {
      if (data.noMoveDown) {
        return false;
      }
      const parent = node.parent;
      const children = parent.data[this.childrenKey] || parent.data;
      if (children.length <= 1) {
        return false;
      }
      const index = children.findIndex(d => d.id === data.id);
      if (index === children.length - 1) {
        return false;
      }
      return !children[index + 1].noOper;
    },
    currentChange(data, node) {
      if (data.id != this.currentNodeKey) {
        this.$emit("current-change", data, node);
        this.currentNodeKey = data.id;
      }
    },
    handleNodeClick(data, node, item) {
      this.$emit("node-click", data, node, item);
      this.currentNodeKey = data.id;
    },
    setCurrentKey(nodeKey) {
      this.$nextTick(() => {
        this.currentNodeKey = nodeKey;
        this.$refs.opertree.setCurrentKey(nodeKey);
        if (nodeKey) {
          this.expandParents(nodeKey);
        }
      });
    },
    expandParents(nodeKey) {
      this.$nextTick(() => {
        const node = this.$refs.opertree.getNode(nodeKey);
        if (node) {
          const parent = node.parent;
          if (parent && parent.data) {
            this.expandKey = [parent.data.id];
          }
        }
      });
    },
    getNodeClasses(data, node) {
      switch (typeof this.nodeClassName) {
        case "undefined":
          return;
        case "string":
          return this.nodeClassName;
        case "function":
          return this.nodeClassName(data, node);
      }
    }
  }
};
</script>


<style>
.opertree .el-tree-node.is-current > :first-child .opertree-btn {
  display: block;
}

.opertree .el-tree-node__content {
  height: auto;
}

.opertree-node {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding-right: 16px;
}

.opertree-btn {
  width: 20px;
  vertical-align: middle;
  text-align: center;
  display: none;
}

.opertree-opts {
  margin: 0 -12px;
}

.opertree-opts li {
  height: 36px;
  line-height: 36px;
  padding: 0 16px;
  cursor: pointer;
}

.opertree-opts li:hover {
  background: #fafafa;
}
.opertree-node-label {
  display: flex;
  height: 40px;
}
.opertree-node-label img {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  margin-top: 8px;
}
.opertree-node-label p {
  font-size: 14px;
  line-height: 24px;
  margin-top: 8px;
  margin-right: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 110px;
  overflow: hidden;
}

.opertree.el-tree
  .el-tree-node
  .el-tree-node__children
  .el-tree-node__content
  .opertree-node-label
  p {
  width: 100px;
}

.opertree.el-tree
  .el-tree-node
  .el-tree-node__children
  .el-tree-node__children
  .el-tree-node__content
  .opertree-node-label
  p {
  width: 80px;
}

.opertree.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: #f5f5f5;
}
.opertree-btn i {
  font-size: 20px;
  color: #999999;
}
.opertree-node-oper {
  margin-top: 10px;
}
</style>
