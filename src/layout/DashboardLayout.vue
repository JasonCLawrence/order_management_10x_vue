<template>
    <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
        <side-bar :background-color="sidebarBackground" short-title="OMS" title="OMS">
            <template slot="links">
                <sidebar-item
                    :link="{
            name: 'Dashboard',
            icon: 'ni ni-tv-2 text-primary',
            path: '/dashboard'
          }"
                />

                <sidebar-item
                    :link="{name: 'Users', icon: 'ni ni-single-02 text-blue', path: '/users'}"
                />
                <sidebar-item
                    :link="{name: 'Orders', icon: 'ni ni-pin-3 text-blue', path: '/orders'}"
                />
                <sidebar-item
                    :link="{name: 'Fleet', icon: 'ni ni-delivery-fast text-blue', path: '/fleet'}"
                />
                <sidebar-item
                    :link="{name: 'Customers', icon: 'ni ni-single-02 text-blue', path: '/customers'}"
                />
                <sidebar-item
                    :link="{name: 'Warehouses', icon: 'ni ni-shop text-blue', path: '/warehouses'}"
                />
                <sidebar-item
                    :link="{name: 'Reports', icon: 'ni ni-chart-bar-32 text-blue', path: '/reports'}"
                />
                <sidebar-item
                    :link="{name: 'Audit Logs', icon: 'ni ni-bullet-list-67 text-blue', path: '/auditlogs'}"
                />
                <sidebar-item
                    :link="{name: 'Settings', icon: 'ni ni-settings text-blue', path: '/settings'}"
                />
            </template>
        </side-bar>
        <div class="main-content" :data="sidebarBackground">
            <dashboard-navbar></dashboard-navbar>

            <div @click="toggleSidebar">
                <fade-transition :duration="200" origin="center top" mode="out-in">
                    <!-- your content here -->
                    <router-view></router-view>
                </fade-transition>
            </div>
        </div>
    </div>
</template>
<script>
import DashboardNavbar from './DashboardNavbar.vue'
import ContentFooter from './ContentFooter.vue'
import { FadeTransition } from 'vue2-transitions'

export default {
    components: {
        DashboardNavbar,
        ContentFooter,
        FadeTransition,
    },
    data() {
        return {
            sidebarBackground: 'vue', //vue|blue|orange|green|red|primary
        }
    },
    methods: {
        toggleSidebar() {
            if (this.$sidebar.showSidebar) {
                this.$sidebar.displaySidebar(false)
            }
        },
    },
}
</script>
<style lang="scss">
</style>
