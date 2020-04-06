<template>
    <div>
        <h6 class="heading-small text-muted mb-4">Warehouse Signature</h6>

        <template v-if="order.warehouse_signature_data!=null">
            <div class="row">
                <img :src="imagedata" />
            </div>
            <div class="row pt-2">Signee: {{ order.warehouse_signee }}</div>
        </template>
        <div v-else style="padding:5em 0; text-align:center;">No Warehouse Signature</div>
    </div>
</template>

<script>
import api from '@/api/order'
import moment from 'moment'

export default {
    name: 'warehouse-signature',
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
                return (
                    'data:image/png;base64,' +
                    this.order.warehouse_signature_data
                )
            } else {
                return null
            }
        },
    },
}
</script>

<style lang="scss" scoped>
</style>