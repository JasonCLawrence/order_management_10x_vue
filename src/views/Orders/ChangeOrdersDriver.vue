<template>
    <modal :show="visible" modalClasses="wide-modal" @close="close()">
        <form role="form" submit.prevent="submit">
            <h2 class="text-center">Set Driver</h2>

            <div class="form-group">
                <label class="form-control-label">Driver</label>
                <div class="has-label">
                    <select
                        id="driver"
                        name="driver"
                        class="form-control"
                        v-model="driverId"
                        v-validate="'required'"
                    >
                        <option
                            v-for="(driver, key) in drivers"
                            :value="driver.id"
                            :key="key"
                        >{{driver.first_name}} {{driver.last_name}}</option>
                    </select>
                </div>
                <div
                    class="text-danger invalid-feedback"
                    style="display: block;"
                    v-if="errors.has('driver')"
                >{{ errors.first('driver') }}</div>
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
                >{{ submitting?'Submitting':'Assign' }}</base-button>
            </div>
        </form>
    </modal>
</template>

<script>
import api from '@/api/order'
import flatPicker from 'vue-flatpickr-component'

export default {
    name: 'change-orders-driver',
    components: { flatPicker },
    props: ['orders'],
    data: () => {
        return {
            visible: false,
            drivers: [],
            driverId: 0,
            submitting: false,
        }
    },
    created() {},
    methods: {
        show() {
            this.visible = true
            this.driverId = 0
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
                .dispatch('orders/bulkSetDriver', {
                    orders: this.orders,
                    driverId: this.driverId,
                })
                .then(x => {
                    this.$swal.fire(
                        'Success!',
                        'Selected orders were marked as complete',
                        'success'
                    )

                    this.$emit('success')
                    this.visible = false
                })
                .catch(x => {
                    this.$swal.fire(
                        'Error!',
                        'There was an error marking orders as complete',
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
        api.fetchDrivers().then(result => {
            let drivers = result.data.success.data
            this.drivers = drivers

            // if there is no assigned driver, assign the first one
            if (!this.driverId && drivers.length > 0)
                this.driverId = drivers[0].id
        })
    },
}
</script>
