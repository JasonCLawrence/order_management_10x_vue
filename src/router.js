import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
import store from '@/store'

Vue.use(Router)

let router = new Router({
    linkExactActiveClass: 'active',
    routes: [
        {
            path: '/',
            redirect: 'dashboard',
            component: DashboardLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Dashboard.vue'),
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Users.vue'),
                },
                {
                    path: '/users/:id',
                    name: 'viewUsers',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Users/ViewUser.vue'),
                },
                {
                    path: '/orders',
                    name: 'orders',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Orders/Orders.vue'),
                },
                {
                    path: '/orders/:id',
                    name: 'viewOrder',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Orders/ViewOrder.vue'),
                },
                {
                    path: '/fleet',
                    name: 'fleet',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Fleet/Fleet.vue'),
                },
                {
                    path: '/fleet/:id',
                    name: 'viewVehicle',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Fleet/ViewVehicle.vue'),
                },
                {
                    path: '/customers',
                    name: 'customers',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Customers/Customers.vue'),
                },
                {
                    path: '/customers/:id',
                    name: 'ciewCustomer',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Customers/ViewCustomer.vue'),
                },
                {
                    path: '/warehouses',
                    name: 'warehouses',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Warehouses/Warehouses.vue'),
                },
                {
                    path: '/warehouses/:id',
                    name: 'viewWarehouse',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Warehouses/ViewWarehouse.vue'),
                },
                // {
                //   path: '/settings',
                //   name: 'settings',
                //   component: () => import(/* webpackChunkName: "demo" */ './views/UserProfile.vue')
                // },
                {
                    path: '/reports',
                    name: 'reports',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Reports/Reports.vue'),
                },
                {
                    path: '/auditlogs',
                    name: 'auditlogs',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/AuditLogs/AuditLogs.vue'),
                },
                {
                    path: '/settings',
                    name: 'settings',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/CompanySettings.vue'),
                },
                {
                    path: '/maps',
                    name: 'maps',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Maps.vue'),
                },
                {
                    path: '/tables',
                    name: 'tables',
                    component: () =>
                        import(/* webpackChunkName: "demo" */ './views/Tables.vue'),
                },
            ],
        },
        {
            path: '/login',
            component: () => {
                return import(/* webpackChunkName: "demo" */ './views/Login.vue')
            },
        },
        {
            path: '/forgot_password',
            component: () => {
                return import(/* webpackChunkName: "demo" */ './views/ForgotPassword.vue')
            },
        },
        {
            path: '/reset_password',
            component: () => {
                return import(/* webpackChunkName: "demo" */ './views/ChangePassword.vue')
            },
        },
    ],
})

router.beforeEach((to, from, next) => {
    let unAuthWhiteList = ['/login', '/forgot_password', '/reset_password']
    if (store.state.token != null) {
        if (to.fullPath === '/login') {
            // carry user straight to dashboard
            next('/dashboard')
        } else {
            next()
        }
    } else {
        // token is null, user can only go to login page
        //if (to.fullPath !== '/login') {
            console.log(to);
        if (unAuthWhiteList.includes(to.path)) {
            next()
        } else {
            next('/login')
        }
    }

    //next();
})

export default router
