<template>
  <div class="container">
    <el-container>
      <el-header>
        <div class="header-title">
          <img src="./images/logo@2x.png" />
          <span>
            <%name%>
          </span>
        </div>
        <%#if withLogin%>
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
            <span class="header-user-name">{{name}}</span>
            <i class="icon-arrow-line"></i>
          </div>
          <el-dropdown-menu
            class="header-oper-menu"
            slot="dropdown"
          >
            <el-dropdown-item command="head">
              <i class="icon-modify-picture"></i>修改头像</el-dropdown-item>
            <el-dropdown-item command="modify">
              <i class="icon-modify"></i>修改资料</el-dropdown-item>
            <el-dropdown-item command="quit">
              <i class="icon-quit"></i>退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <%/if%>
      </el-header>
      <el-container>
        <el-aside width="240px">
          <left-menu :menus="menus"></left-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import LeftMenu from "@/components/common/LeftMenu";
/*<%#if withLogin%>*/
import { logout } from "@/service";
/*<%/if%>*/

export default {
  name: "app",
  props: ["menus"],
  components: {
    LeftMenu
  },
  data() {
    return {
      avatar: "",
      name: ""
    };
  },
  methods: {
    /*<%#if withLogin%>*/
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
    /*<%/if%>*/
  },
  mounted() {}
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  min-width: 1336px;
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

/*<%#if withLogin%>*/
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
/*<%/if%>*/
</style>

<%#if withLogin%>
<style>
.header-oper-menu i {
  font-size: 20px;
  vertical-align: -4px;
  margin-right: 4px;
}
.header-oper-menu.el-dropdown-menu--medium .el-dropdown-menu__item {
  padding: 8px 16px;
}
.header-oper-menu .el-dropdown-menu__item:not(.is-disabled):hover {
  color: #666;
}

.header-oper-menu .el-dropdown-menu__item:not(.is-disabled):active {
  background-color: #f5f5f5;
}
</style>
<%/if%>
