<template>
    <nav
        class="navbar"
        :class="[
            {'navbar-expand-md': expand},
            {'navbar-transparent': transparent},
            {[`bg-${type}`]: type}
         ]"
    >
        <div :class="containerClasses">
            <slot name="brand">
                <!-- <router-link
                    :to="$route.path"
                    class="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
                >{{$route.name}}</router-link>-->
                <template v-for="(path, key) in paths">
                    <span
                        class="h4 mb-0 text-lg text-white text-uppercase d-none d-lg-inline-block"
                        :key="key + 'span'"
                        v-if="key != 0"
                    >&nbsp;/&nbsp;</span>
                    <router-link
                        :to="path.path"
                        class="h4 mb-0 text-lg text-white text-uppercase d-none d-lg-inline-block"
                        :key="key"
                    >{{path.text}}</router-link>
                </template>
            </slot>
            <navbar-toggle-button
                v-if="showToggleButton"
                :toggled="toggled"
                :target="contentId"
                @click.native.stop="toggled = !toggled"
            >
                <span class="navbar-toggler-icon"></span>
            </navbar-toggle-button>

            <div
                class="collapse navbar-collapse"
                :class="{show: toggled}"
                :id="contentId"
                v-click-outside="closeMenu"
            >
                <slot :close-menu="closeMenu"></slot>
            </div>
        </div>
    </nav>
</template>
<script>
import NavbarToggleButton from './NavbarToggleButton'

export default {
    name: 'base-nav',
    components: {
        NavbarToggleButton,
    },
    props: {
        type: {
            type: String,
            default: '',
            description: 'Navbar type (e.g default, primary etc)',
        },
        title: {
            type: String,
            default: '',
            description: 'Title of navbar',
        },
        contentId: {
            type: [String, Number],
            default: Math.random().toString(),
            description:
                "Explicit id for the menu. By default it's a generated random number",
        },
        containerClasses: {
            type: [String, Object, Array],
            default: 'container-fluid',
        },
        transparent: {
            type: Boolean,
            default: false,
            description: 'Whether navbar is transparent',
        },
        expand: {
            type: Boolean,
            default: false,
            description:
                'Whether navbar should contain `navbar-expand-lg` class',
        },
        showToggleButton: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            toggled: false,
            paths: [],
        }
    },
    methods: {
        closeMenu() {
            this.toggled = false
        },
        calcPath() {
            // generate path
            let pathSplit = this.$route.path.split('/')
            pathSplit.splice(0, 1) // remove

            let paths = []
            let runningPath = ''
            for (let segment of pathSplit) {
                runningPath += '/' + segment

                paths.push({
                    path: runningPath,
                    text: segment,
                })
            }

            this.paths = paths
            console.log(paths)
        },
    },
    mounted() {
        this.calcPath()
    },
    watch: {
        $route(to, from) {
            console.log('new path')
            this.calcPath()
        },
    },
}
</script>
<style>
</style>
