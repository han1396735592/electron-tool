import Vue from 'vue'
import Router from 'vue-router'

try {
    const originalPush = Router.prototype.push
    Router.prototype.push = function push(location) {
        return originalPush.call(this, location).catch(err => err)
    }
} catch (e) {
}

Vue.use(Router)

import Home from "@views/Home";
import {CHANNEL_NAME_MAP} from '@views/tool/const'

const dynamicComponent = []
for (let channelNameMapKey in CHANNEL_NAME_MAP) {
    dynamicComponent.push({
        path: "/" + channelNameMapKey,
        meta: {
            title: CHANNEL_NAME_MAP[channelNameMapKey].name
        },
        component: () => import('@views/tool/' + CHANNEL_NAME_MAP[channelNameMapKey].component)
    })
}

export default new Router({
    base: process.env.BASE_URL,
    scrollBehavior: () => ({y: 0}),
    routes: [{
        path: '/',
        component: Home,
        redirect: "/info",
        children: [{
            path: '/info',
            meta: {
                title: '首页'
            },
            component: () => import('@views/AppInfo')
        }, ...dynamicComponent, {
            path: '/forward',
            meta: {
                title: '数据转发'
            },
            component: () => import('@views/tool/Index')
        }]
    }
    ]
})
