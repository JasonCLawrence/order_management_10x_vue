<template>
    <modal :show="visible" modalClasses="wide-modal" @close="close()">
        <form role="form" submit.prevent="submit">
            <h2 class="text-center">Set Warehouse</h2>

            <div class="form-group">
                <label class="form-control-label">Warehouse</label>
                <div class="has-label">
                    <select
                        id="warehouse"
                        name="driver"
                        class="form-control"
                        v-model="warehouseId"
                        v-validate="'required'"
                    >
                        <option
                            v-for="(el, key) in warehouses"
                            :value="el.id"
                            :key="key"
                        >{{el.name}}</option>
                    </select>
                </div>
                <div
                    class="text-danger invalid-feedback"
                    style="display: block;"
                    v-if="errors.has('warehouse')"
                >{{ errors.first('warehouse') }}</div>
            </div>

            <div class="text-right">
                <base-button
                    class="my-4"
                    type="warning"
                    :disabled="submitting?true:false"
                    @click="cancel()"
                >Cancel</base-button>
                <base-button
                    class="my-4"
                    type="primary"
                    :disabled="submitting?true:false"
                    @click="submit()"
                >{{ submitting?'Submitting':'Change' }}</base-button>
            </div>
        </form>
    </modal>
</template>

<script>
import api from '@/api/order'
import flatPicker from 'vue-flatpickr-component'

export default {
    name: 'change-orders-warehouse',
    components: { flatPicker },
    props: ['orders'],
    data: () => {
        return {
            visible: false,
            warehouses: [],
            warehouseId: 0,
            submitting: false,
        }
    },
    created() {},
    methods: {
        show() {
            this.visible = true
            this.warehouseId = 0
        },
        close() {
            this.visible = false
        },
        cancel() {
            this.visible = false
        },
        submit() {
            this.submitting = true
            this.$store
                .dispatch('orders/bulkSetWarehouse', {
                    orders: this.orders,
                    warehouseId: this.warehouseId,
                })
                .then(x => {
                    this.$swal.fire('Success!', 'Warehouse changed', 'success')

                    this.$emit('success')
                    this.visible = false
                })
                .catch(x => {
                    this.$swal.fire(
                        'Error!',
                        'Error changing warehouse',
                        'error'
                    )

                    this.$emit('error')
                    this.visible = false
                })
                .finally(x => {
                    this.submitting = false
                })
        },
    },
    mounted() {
        api.fetchWarehouses().then(result => {
            let warehouses = result.data.success.data
            this.warehouses = warehouses

            // if there is no assigned warehouse, assign the first one
            if (!this.warehouseId && warehouses.length > 0)
                this.warehouseId = warehouses[0].id
        })
    },
}
</script>
