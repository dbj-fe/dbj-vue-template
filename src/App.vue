<template>
  <div class="container">
    <el-container>
      <el-header>
        <div class="header-title">
          <div class="logo-wrapper">
            <img
              v-if="logoSrc"
              :src="`${logoSrc}?x-oss-process=image/resize,m_lfit,h_80,w_300`"
            >
            <img
              v-else
              src="./images/logo@2x.png"
            >
          </div>
          <div class="header-title-name">
            {{ companyName }} <span class="line" />企业后台
          </div>
        </div>
        <el-dropdown
          trigger="click"
          size="medium"
          @command="userOper"
        >
          <div class="header-info">
            <div class="avatar-wrapper">
              <img
                v-if="avatar"
                :src="`${avatar}?x-oss-process=image/resize,m_lfit,h_80,w_80`"
              >
              <img
                v-else
                src="./images/person-black@2x.png"
              >
            </div>
            <span class="header-user-name">{{ name }}</span>
            <i class="icon-arrow-line" />
          </div>
          <el-dropdown-menu
            slot="dropdown"
            class="header-oper-menu"
          >
            <el-dropdown-item command="head">
              <i class="icon-modify-picture" />修改资料
            </el-dropdown-item>
            <el-dropdown-item command="modify">
              <i class="icon-edit-password" />修改密码
            </el-dropdown-item>
            <el-dropdown-item command="quit">
              <i class="icon-quit" />退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container style="height: 100%;min-height: 0;">
        <el-aside width="240px">
          <left-menu :menus="menus" />
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <edit-password-dialog
      v-if="showEditUserPassword"
      @close="showEditUserPassword = false"
      @submit="afterEditUserPasswordDialog"
    />
    <edit-user-data-dialog
      v-if="showEditUserData"
      :name="name"
      :avatar="avatar"
      @close="showEditUserData = false"
      @submit="afterEditUserDataDialog"
    />
  </div>
</template>

<script>
import LeftMenu from "@/components/common/LeftMenu";
import EditPasswordDialog from "@/components/common/dialogs/EditUserPasswordDialog";
import EditUserDataDialog from "@/components/common/dialogs/EditUserDataDialog";
import { logout, getUserInfo } from "@/service";
export default {
  name: "App",
  components: {
    LeftMenu,
    EditPasswordDialog,
    EditUserDataDialog
  },
  props: ["user", "company", "menus"],
  data() {
    return {
      name: "",
      avatar: "",
      companyName: "",
      logoSrc: "",
      showEditUserPassword: false,
      showEditUserData: false
    };
  },
  mounted() {
    if (this.user && this.company) {
      this.name = this.user.name;
      this.avatar = this.user.avatar;
      this.logoSrc = this.company.clientLogo;
      this.companyName = this.company.shortName || this.company.name;
    }
  },
  methods: {
    userOper(command) {
      if (command === "quit") {
        logout().then(res => {
          window.location.href = "//" + window.location.host;
        });
      } else if (command === "modify") {
        this.showEditUserPassword = true;
      } else if (command === "head") {
        this.showEditUserData = true;
      }
    },
    getUserInfo() {
      getUserInfo().then(res => {
        if (res.code == 1 && res.data) {
          this.name = res.data.user.name;
          this.avatar = res.data.user.avatar;
          this.logoSrc = res.data.company.clientLogo;
          this.companyName =
            res.data.company.shortName || res.data.company.name;
        }
      });
    },
    afterEditUserDataDialog() {
      this.showEditUserData = false;
      this.getUserInfo();
    },
    afterEditUserPasswordDialog() {
      this.showEditUserPassword = false;
      this.userOper("quit");
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
  padding: 0 0 0 24px;
}

.el-aside {
  background: #4d4d4d;
  padding: 20px 0;
}

.el-main {
  background: #f0f0f0;
  padding: 0;
  position: relative;
  height: 100%;
}

.header-title {
  color: #fff;
  font-size: 18px;
  font-weight: normal;
  display: flex;
  align-items: center;
}
.logo-wrapper {
  width: 150px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.logo-wrapper img {
  max-width: 150px;
  max-height: 40px;
}
.header-title .header-title-name {
  font-size: 18px;
  color: #ffffff;
  display: flex;
  align-items: center;
  margin-left: 8px;
}
.header-title .line {
  width: 1px;
  height: 18px;
  background: #666666;
  margin: 0 16px;
}

.header-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  padding: 0 32px;
}

.header-info:hover {
  background-color: #333;
}

.avatar-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-wrapper img {
  display: block;
  max-width: 40px;
  max-height: 40px;
  border-radius: 50%;
}

.header-info .el-dropdown {
  display: flex;
  align-items: center;
}

.header-user-name {
  font-size: 14px;
  color: #bdbdbd;
  margin-left: 8px;
}

.header-info i {
  font-size: 20px;
  color: #bdbdbd;
  margin-left: 8px;
}
.header-oper-menu {
  width: 120px;
}
</style>

<style>
.header-oper-menu i {
  font-size: 20px;
  vertical-align: -3px;
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
