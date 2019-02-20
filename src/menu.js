import lodash from "lodash";

let defaultPath = '/test';
let menus = [
  {
    title: "测试",
    icon: "icon-project",
    path: "/test",
    routeNames: []
  },
  /*<%#if withDemo%>*/
  {
    title: "样例库",
    icon: "icon-project",
    children: [
      {
        title: "表格",
        path: "/demo/table",
        routeNames: [],
        permCode: ""
      },
      {
        title: "列表",
        path: "/demo/list",
        routeNames: ['demoListDetail'],
        permCode: ""
      },
      {
        title: "表单",
        path: "/demo/form",
        routeNames: [],
        permCode: ""
      },
      {
        title: "详情",
        path: "/demo/detail",
        routeNames: [],
        permCode: ""
      },
      {
        title: "选项卡",
        path: "/demo/tabs",
        routeNames: [],
        permCode: ""
      },
      /*<%#if withRichEditor%>*/
      {
        title: "编辑器",
        path: "/demo/editor",
        routeNames: [],
        permCode: ""
      },
      /*<%/if%>*/
      {
        title: "组件",
        path: "/demo/comps",
        routeNames: [],
        permCode: ""
      }
    ]
  }
  /*<%/if%>*/
];

/**
 * 根据权限过滤菜单
 * @param {Array} perms
 * @param {Boolean} accountAdmin
 */
function getMenus(perms = [], accountAdmin = false) {
  if (accountAdmin) {
    return {
      menus: menus,
      defaultPath: defaultPath
    };;
  }
  let menuList = [];
  let permMap = {};
  let containsDefaltPath = false;
  perms.forEach(p => {
    permMap[p] = true;
  });

  menus.forEach((m, i) => {
    if (m.children && m.children.length) {
      let children = m.children.filter(c => !c.permCode || permMap[c.permCode]);
      if (children.length) {
        menuList.push(lodash.assign({}, m, { children }));
        if (children.some(c => c.path == defaultPath)) {
          containsDefaltPath = true;
        }
      }
    } else {
      if (!m.permCode || permMap[m.permCode]) {
        menuList.push(lodash.assign({}, m));
        if (m.path == defaultPath) {
          containsDefaltPath = true;
        }
      }
    }
  });
  if (!containsDefaltPath && menuList.length) {
    if (menuList[0].children && menuList[0].children.length) {
      defaultPath = menuList[0].children[0].path;
    } else {
      defaultPath = menuList[0].path;
    }
  }
  return {
    menus: menuList,
    defaultPath: defaultPath
  };
}

export default getMenus;