// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Element from '@dbj-fe/element-ui'
import { DbjUpload, DbjUploadImage, DbjReader, DbjDirUpload } from '@dbj-fe/element-ui'
import CollapseTransition from "@dbj-fe/element-ui/lib/transitions/collapse-transition"
import LazyLoad from "@/components/common/LazyLoad"

/*<%#if withLogin%>*/
import { loginWithToken, getUserInfo, getUploadToken } from './service'
/*<%else%>*/
import { getUploadToken } from './service'
/*<%/if%>*/

import Bus from "@/Bus";
/*<%#if withRichEditor%> 富文本编辑器 */
import QuillEditor from 'vue-quill-editor'
/*<%/if%>*/
Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'medium' }
Vue.use(Element, { size: 'medium' });
Vue.use(DbjUpload, {
  requestToken: {
    type: Function,
    default: getUploadToken
  }
});
Vue.use(DbjUploadImage, {
  requestToken: {
    type: Function,
    default: getUploadToken
  }
});
Vue.use(DbjReader);
Vue.use(DbjDirUpload, {
  requestToken: {
    type: Function,
    default: getUploadToken
  }
});

Vue.component(CollapseTransition.name, CollapseTransition);
Vue.component(LazyLoad.name, LazyLoad);
/*<%#if withRichEditor %> 富文本编辑器 */
Vue.use(QuillEditor);
/*<%/if %>*/

import moment from 'moment'
/*<%#if withRichEditor%> 富文本编辑器样式 */
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
/*<%/if%>*/
import "@/style/common/base.scss"
import './style/element-variables.scss'
import "@/style/icon/iconfont.css"
import "@/style/app.css"
import App from './App'
import getMenus from './menu'
import createRouter from './router'
/*<%#if withLogin%>*/
import Login from './Login'
import { parseURL } from './utils/util'
/*<%/if%>*/

Vue.filter('formatDate', function (value, formatStr) {
  if (!value || isNaN(value)) {
    return '-';
  }
  return moment(value, 'x').format(formatStr || 'YYYY-MM-DD HH:mm:ss')
});

Vue.directive('requested', {
  bind(el) {
    el.style.display = 'none';
    function showEl() {
      Bus.$off("request-finished", showEl);
      el.style.display = '';
      el = null;
    }
    Bus.$on("request-finished", showEl);
  }
});

/*<%#if withLogin%> 登录页处理 */

let { params, hash } = parseURL(window.location.href);
if (params.token) {
  // eslint-disable-next-line
  console.debug(params.token, params.loginId);
  loginWithToken({ token: params.token, loginId: params.loginId }).then(res => {
    window.location.href = "/#" + hash;
  });
} else {
  let loginView = () => {
    new Vue({
      el: '#app',
      components: { Login },
      template: '<Login/>'
    });
  }
  getUserInfo().then(res => {
    if (res.code == 1 && res.data) {
      let {
        user = {},
        permissionCodes = [],
        company = {}
      } = res.data;
      let accountAdmin = user.accountAdmin;
      let { menus, defaultPath } = getMenus(permissionCodes, accountAdmin);
      if (menus.length) {
        new Vue({
          el: '#app',
          components: { App },
          data: {
            user: user,
            company: company,
            menus: menus
          },
          router: createRouter(defaultPath),
          template: '<App :user="user" :company="company" :menus="menus"/>'
        });
        Vue.prototype.hasPerm = function (permCode) {
          if (permissionCodes && permissionCodes.length) {
            return permissionCodes.indexOf(permCode) >= 0;
          }
          return false;
        };
      } else {
        loginView();
      }
    } else {
      loginView();
    }
  }).catch(([err, status]) => {
    console.error(err, status);
    loginView();
  })
}
/*<%else%> 无登录页 */
let perms = [];
let accountAdmin = true;
let { menus, defaultPath } = getMenus(perms, accountAdmin);

new Vue({
  el: '#app',
  components: { App },
  data: {
    menus: menus
  },
  router: createRouter(defaultPath),
  template: '<App :menus="menus"/>'
})
/*<%/if%>*/
