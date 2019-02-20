import Vue from 'vue'
import Router from 'vue-router'
/*<%#if withDemo%>*/
import DemoList from '@/views/demo/List'
import DemoTable from '@/views/demo/Table'
import DemoForm from '@/views/demo/Form'
import DemoDetail from '@/views/demo/Detail'
import DemoTabs from '@/views/demo/Tabs'
import DemoComps from '@/views/demo/Comps'
/*<%#if withRichEditor%>*/
import DemoEditor from '@/views/demo/Editor'
/*<%/if%>*/
/*<%/if%>*/
import Test from '@/views/Test'

Vue.use(Router)

function createRouter(defaultPath) {
  return new Router({
    routes: [
      {
        path: '/',
        redirect: defaultPath
      },
      /*<%#if withDemo%>*/
      {
        path: '/demo/table',
        name: "demoTable",
        component: DemoTable
      },
      {
        path: '/demo/list',
        name: "demoList",
        component: DemoList
      },
      {
        path: '/demo/listDetail/:id',
        name: "demoListDetail",
        component: DemoDetail
      },
      {
        path: '/demo/form',
        name: "demoForm",
        component: DemoForm
      },
      {
        path: '/demo/detail',
        name: "demoDetail",
        component: DemoDetail
      },
      {
        path: '/demo/tabs',
        name: "demoTabs",
        component: DemoTabs
      },
      /*<%#if withRichEditor%>*/
      {
        path: '/demo/editor',
        name: "demoEditor",
        component: DemoEditor
      },
      /*<%/if%>*/
      {
        path: '/demo/comps',
        name: "demoComps",
        component: DemoComps
      },
      /*<%/if%>*/
      {
        path: '/test',
        name: 'test',
        component: Test
      }
    ]
  });
}

export default createRouter;
