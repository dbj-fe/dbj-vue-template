<template>
  <div class="container">
    <el-container>
      <el-header>
        <div class="header-title">
          <img src="./images/logo@2x.png">
          <span>BIM企业后台</span>
        </div>
        <el-dropdown
          trigger="click"
          size="medium"
          @command="userOper"
        >
          <div class="header-info">
            <img
              v-if="avatar"
              :src="avatar"
            >
            <img
              v-else
              src="./images/person-black@2x.png"
            >
            <span class="header-user-name">{{ name }}</span>
            <i class="icon-arrow-line" />
          </div>
          <el-dropdown-menu
            slot="dropdown"
            class="header-oper-menu"
          >
            <el-dropdown-item command="head">
              <i class="icon-modify-picture" />修改头像
            </el-dropdown-item>
            <el-dropdown-item command="modify">
              <i class="icon-modify" />修改资料
            </el-dropdown-item>
            <el-dropdown-item command="quit">
              <i class="icon-quit" />退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="240px">
          <left-menu :menus="menus" />
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import LeftMenu from "@/components/common/LeftMenu";
import { logout } from "@/service";

export default {
  name: "App",
  components: {
    LeftMenu
  },
  props: ["menus"],
  data() {
    return {
      avatar: "",
      name: ""
    };
  },
  methods: {
    userOper(command) {
      switch (command) {
        case "quit":
          logout().then(res => {
            window.location.href = "//" + window.location.host;
          });
          break;
        case "modify":
          break;
        case "head":
          break;
      }
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  min-width: 1336px;
}

.el-container {
  height: 100%;
}

.el-header {
  width: 100%;
  background: #3d3d3d;
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  padding: 0 0 0 40px;
}

.el-row {
  height: 100%;
}

.el-aside {
  background: #4d4d4d;
  padding: 20px 0;
}

.el-main {
  background: #f0f0f0;
  padding: 0;
  height: 100%;
}

.header-title {
  color: #fff;
  font-size: 18px;
  font-weight: normal;
  display: flex;
  align-items: center;
}

.header-title img {
  width: 100px;
  height: 40px;
  margin-right: 20px;
}

.header-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  padding: 0 32px;
  height: 100%;
}

.header-info:hover {
  background-color: #333;
}
.header-info img {
  display: inline-block;
  max-width: 40px;
  max-height: 40px;
  border-radius: 50%;
  margin-right: 8px;
}

.header-info .el-dropdown {
  display: flex;
  align-items: center;
}
.header-user-name {
  font-size: 14px;
  color: #bdbdbd;
}
.header-info i {
  font-size: 20px;
  color: #bdbdbd;
  margin-left: 8px;
}
.header-oper-menu {
  width: 120px;
}

.header-oper-menu >>> i {
  font-size: 20px;
  vertical-align: -4px;
  margin-right: 4px;
}
.header-oper-menu >>> .el-dropdown-menu__item {
  padding: 8px 16px;
}
</style>