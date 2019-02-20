<template>
  <el-menu
    :default-active="activeIndex"
    :router="true"
    :unique-opened="true"
    background-color="#4d4d4d"
    text-color="#bdbdbd"
    active-text-color="#fff"
    active-background-color="#3d3d3d"
    @select="menuChange"
  >
    <template v-for="(menu,idx) in menus">
      <el-menu-item
        v-if="!menu.children || !menu.children.length"
        :key="idx"
        :index="menu.path"
      >
        <i
          class="font24"
          :class="menu.icon"
        ></i>
        <span slot="title">{{menu.title}}</span>
      </el-menu-item>
      <el-submenu
        v-else
        :key="idx"
        :index="menu.path || `${idx}`"
      >
        <template slot="title">
          <i
            class="font24"
            :class="menu.icon"
          ></i>
          <span>{{menu.title}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="(sub, idx2) in menu.children"
            :index="sub.path"
            :key="`${idx}-${idx2}`"
          >
            <span>{{sub.title}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
import { clearQuery } from "@/utils/queryMixin";

export default {
  name: "LeftMenu",
  props: ["menus"],
  computed: {
    routeIndexMap() {
      let map = {};
      const mapNames = (names, path) => {
        if (names && names.length) {
          names.forEach(name => {
            map[name] = path;
          });
        }
      };
      this.menus.forEach(m => {
        if (m.children && m.children.length) {
          m.children.forEach(sub => {
            mapNames(sub.routeNames, sub.path);
          });
        } else {
          mapNames(m.routeNames, m.path);
        }
      });
      return map;
    },
    activeIndex() {
      return this.routeIndexMap[this.$route.name] || this.$route.path;
    }
  },
  methods: {
    menuChange(index, indexPath) {
      clearQuery();
    }
  }
};
</script>

<style scoped>
.font24 {
  font-size: 24px;
}
.el-menu {
  border: none;
  user-select: none;
}
.el-menu-item.is-active {
  background: #3d3d3d !important;
  position: relative;
}
.el-menu-item.is-active::before {
  content: " ";
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: #ffa800;
}
.el-menu-item span,
.el-submenu span {
  margin-left: 12px;
}
.el-menu-item-group .el-menu-item span {
  margin-left: 20px;
}
</style>

