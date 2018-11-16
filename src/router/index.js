import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index/index'
import main from '@/components/main/index'
import demo from '@/components/demo/index'

import approval from '@/components/approval'
import information from '@/components/information'
import workApply from '@/components/workApply'
import view from '@/components/view'

import '@/assets/index.css'
import '@/assets/common.css'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'main'
      }
    },
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/main',
          name: 'main',
          component: main
        },
        {
          path: '/demo',
          name: 'demo',
          component: demo,
        },
        {
          path: '/approval',
          name: 'approval',
          component: approval
        },
        {
          path: '/view',
          name: 'view',
          component: view
        },
        {
          path: '/workApply',
          name: 'workApply',
          component: workApply
        },
        {
          path: '/information',
          name: 'information',
          component: information
        }

      ]
    },

  ]
})
