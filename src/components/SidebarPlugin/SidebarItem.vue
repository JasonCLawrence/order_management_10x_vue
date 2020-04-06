<template>
    <li class="nav-item">
        <router-link
            :to="link.path"
            @click.native="linkClick"
            class="nav-link"
            :target="link.target"
            activeClass="active"
            :href="link.path"
        >
            <template>
                <i :class="link.icon"></i>
                <span class="nav-link-text">{{ link.name }}</span>
            </template>
        </router-link>
        <div class="collapse" :class="{hide : collapsed, show : !collapsed}">
            <ul clas="nav nav-sm flex-column">
                <slot></slot>
            </ul>
        </div>
    </li>
</template>
<script>
export default {
    name: 'sidebar-item',
    props: {
        link: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    path: '',
                    children: [],
                }
            },
            description:
                'Sidebar link. Can contain name, path, icon and other attributes. See examples for more info',
        },
    },
    inject: {
        autoClose: {
            default: true,
        },
    },
    data() {
        return {
            children: [],
            collapsed: true,
        }
    },
    methods: {
        linkClick() {
            if (
                this.autoClose &&
                this.$sidebar &&
                this.$sidebar.showSidebar === true
            ) {
                this.$sidebar.displaySidebar(false)
            }

            this.collapsed = !this.collapsed
        },
    },
}
</script>

<style scoped>
.active .ni::before {
    color: white !important;
}
</style>