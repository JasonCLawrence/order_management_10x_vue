<template>
    <div>
        <h6 class="heading-small text-muted mb-4">Signature</h6>

        <template v-if="order.signature_data!=null">
            <div class="row">
                <img :src="imagedata" />
            </div>
            <div class="row pt-2">Signee: {{ order.signee }}</div>
        </template>
        <div v-else style="padding:5em 0; text-align:center;">No Signature Data</div>
    </div>
</template>

<script>
import api from '@/api/order'
import moment from 'moment'

export default {
    name: 'signature',
    props: {
        order: {
            type: Object,
            default() {
                return {}
            },
        },
    },
    methods: {},
    mounted() {},
    computed: {
        imagedata() {
            if (this.order) {
                return 'data:image/png;base64,' + this.order.signature_data
            } else {
                return null
            }
        },
    },
    watch: {
        order() {
            //console.log(this.order.signature_data)
        },
    },
}
</script>

<style lang="scss" scoped>
</style>