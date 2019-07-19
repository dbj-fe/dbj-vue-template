// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import {
  Button,
  ButtonGroup,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Row,
  Col,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabPane,
  Card,
  Pagination,
  Dialog,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Message,
  MessageBox,
  Form,
  FormItem,
  Input,
  Switch,
  Upload,
  Table,
  TableColumn,
  Popover,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Select,
  Option,
  OptionGroup,
  Tree,
  Transfer,
  Cascader,
  Tag,
  Tooltip,
  DatePicker,
  Steps,
  Step
} from 'element-ui'

/*<%#if withRichEditor%> 富文本编辑器 */
import QuillEditor from 'vue-quill-editor'
/*<%/if%>*/
Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'small' }

Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Card)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Switch)
Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Popover)
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Tree);
Vue.use(Transfer);
Vue.use(Cascader);
Vue.use(Tag);
Vue.use(Tooltip);
Vue.use(DatePicker);
Vue.use(Steps);
Vue.use(Step);
/*<%#if withRichEditor %> 富文本编辑器 */
Vue.use(QuillEditor);
/*<%/if %>*/

import moment from 'moment'
import lodash from 'lodash'
/*<%#if withLogin%>*/
import { loginWithToken, getUserInfo } from './service'
/*<%/if%>*/
import "../theme/index.css"
/*<%#if withRichEditor%> 富文本编辑器样式 */
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
/*<%/if%>*/
import "@/style/base.css"
import "@/style/icon/iconfont.css"
import "@/style/theme-override.css"
import "@/style/app.css"
import App from './App'
import getMenus from './menu'
import createRouter from './router'
/*<%#if withLogin%>*/
import Login from './Login'
import { parseURL } from './utils/util'
/*<%/if%>*/

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$prompt = MessageBox.prompt
//重写确认弹框样式
Vue.prototype.$confirm = function (message, tip, options) {
  if (typeof tip === "object") {
    options = tip;
  } else {
    options = options || {};
    if (tip) {
      options.dangerouslyUseHTMLString = true;
      message = `<p style="font-size: 14px; color: #333;">${message}</p><p style="font-size: 12px; color: #999;">${tip}</p>`;
    }
  }
  options = lodash.assign({
    "customClass": "mw-confirm-box",
    "type": "warning",
    "showClose": false,
    "closeOnClickModal": false
  }, options)
  return MessageBox.confirm(message, options);
}
//重写消息提示框的样式
const MESSAGE_ICON_CLASS = {
  "success": "icon-success",
  "warning": "icon-warning",
  "error": "icon-error"
}
function MWMessage(options) {
  let defaultOpt = { center: true };
  if (options.type && MESSAGE_ICON_CLASS[options.type]) {
    defaultOpt.iconClass = MESSAGE_ICON_CLASS[options.type];
  }
  options = lodash.assign(defaultOpt, options);
  return Message(options);
}
Vue.prototype.$message = MWMessage;
["success", "warning", "info", "error"].forEach(type => {
  Vue.prototype.$message[type] = function (message) {
    return MWMessage({
      type,
      message
    });
  }
})

Vue.filter('formatDate', function (value, formatStr) {
  if (!value || isNaN(value)) {
    return '-';
  }
  return moment(value, 'x').format(formatStr || 'YYYY-MM-DD HH:mm:ss')
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
            userInfo: user,
            company: company,
            menus: menus
          },
          router: createRouter(defaultPath),
          template: '<App :user-info="userInfo" :company="company" :menus="menus"/>'
        });
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
