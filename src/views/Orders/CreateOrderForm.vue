<template>
    <form role="form" submit.prevent="login">
        <h2 class="text-center">Create Order</h2>

        <div class="form-group">
            <label class="form-control-label">Type</label>
            <div class="has-label">
                <select id="make" name="type" class="form-control" v-model="model.type">
                    <option value="service">Service</option>
                    <option value="invoice">Invoice</option>
                    <option value="delivery">Delivery</option>
                </select>
            </div>
            <div
                class="text-danger invalid-feedback"
                style="display: block;"
                v-if="errors.has('type')"
            >{{ errors.first('type') }}</div>
        </div>

        <div class="form-group">
            <label class="form-control-label">Driver</label>
            <div class="has-label">
                <select id="driver" name="driver" class="form-control" v-model="model.driver_id">
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

        <div class="form-group">
            <label class="form-control-label">Customer</label>
            <div class="has-label">
                <select
                    id="driver"
                    name="customer"
                    class="form-control"
                    v-model="model.customer_id"
                    v-validate="'required'"
                >
                    <option v-for="(el, key) in customers" :value="el.id" :key="key">{{el.name}}</option>
                </select>
            </div>
            <div
                class="text-danger invalid-feedback"
                style="display: block;"
                v-if="errors.has('customer')"
            >{{ errors.first('customer') }}</div>
        </div>

        <div class="form-group">
            <label class="form-control-label">Warehouse</label>
            <div class="has-label">
                <select
                    id="warehouse"
                    name="warehouse"
                    class="form-control"
                    v-model="model.warehouse_id"
                >
                    <option v-for="(el, key) in warehouses" :value="el.id" :key="key">{{el.name}}</option>
                </select>
            </div>
            <div
                class="text-danger invalid-feedback"
                style="display: block;"
                v-if="errors.has('warehouse')"
            >{{ errors.first('warehouse') }}</div>
        </div>

        <base-input label="Date">
            <flat-picker
                slot-scope="{focus, blur}"
                @on-open="focus"
                @on-close="blur"
                :config="{allowInput: true}"
                class="form-control datepicker"
                v-model="model.date"
            ></flat-picker>
        </base-input>

        <base-input label="Time">
            <flat-picker
                slot-scope="{focus, blur}"
                @on-open="focus"
                @on-close="blur"
                :config="{enableTime: true,noCalendar: true,dateFormat: 'H:i:ss'}"
                class="form-control datepicker"
                v-model="model.time"
            ></flat-picker>
        </base-input>

        <base-checkbox v-model="model.signature">Require Signature</base-checkbox>

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
                @click="create()"
            >Create</base-button>
        </div>
    </form>
</template>

<script>
import api from '@/api/order'
import flatPicker from 'vue-flatpickr-component'

//https://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
function pad(num, size) {
    var s = num + ''
    while (s.length < size) s = '0' + s
    return s
}

function now() {
    var dateObj = new Date()
    var month = dateObj.getUTCMonth() + 1
    var day = dateObj.getUTCDate()
    var year = dateObj.getUTCFullYear()

    const date = year + '-' + pad(month, 2) + '-' + pad(day, 2)
    //console.log(date)
    return date
}

//let nowDate = now()

export default {
    name: 'create-order-form',
    components: { flatPicker },
    props: [],
    data: () => {
        return {
            model: {
                type: 'invoice',
                customer_id: '',
                driver_id: '',
                warehouse_id: '',
                date: now(),
                time: '09:30:00',
                signature: false,
                lat: 18.003713067980094,
                long: -76.7883610725403,
            },
            submitting: false,
            hasErrors: false,
            drivers: [],
            warehouses: [],
            customers: [],
        }
    },
    created() {
        this.model.date = now()
    },
    methods: {
        cancel() {
            this.errors.clear()
            this.$emit('cancel')
        },
        create() {
            this.model.schedule_at = this.model.date + ' ' + this.model.time
            this.$validator.validate().then(valid => {
                if (valid) {
                    this.submitting = true
                    this.$store
                        .dispatch('orders/create', this.model)
                        .then(data => {
                            this.submitting = false
                            console.log(data)
                            this.$emit('success', data)

                            this.model = {
                                type: 'invoice',
                                customer_id: '',
                                driver_id: '',
                                warehouse_id: '',
                                date: now(),
                                time: '09:30:00',
                                signature: false,
                                lat: 18.003713067980094,
                                long: -76.7883610725403,
                            }
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.submitting = false
                        })
                } else {
                    this.submitting = false
                }
            })
        },
    },
    mounted() {
        api.fetchDrivers().then(result => {
            let drivers = result.data.success.data
            // drivers = drivers.filter(x => {
            //     let res =
            //         x.roles.findIndex(r => {
            //             return r.role.name == 'driver'
            //         }) !== -1
            //     return res
            // })
            this.drivers = drivers
            console.log('drivers', drivers)

            // if there is no assigned warehouse, assign the first one
            if (!this.model.driver_id && drivers.length > 0)
                this.model.driver_id = drivers[0].id
        })

        api.fetchWarehouses().then(result => {
            let warehouses = result.data.success.data
            this.warehouses = warehouses
            console.log(warehouses)

            // if there is no assigned warehouse, assign the first one
            if (!this.model.warehouse_id && warehouses.length > 0)
                this.model.warehouse_id = warehouses[0].id
        })

        api.fetchCustomers().then(result => {
            let customers = result.data.success.data
            this.customers = customers
            console.log(customers)

            // if there is no assigned warehouse, assign the first one
            if (!this.model.customer_id && customers.length > 0)
                this.model.customer_id = customers[0].id
        })
    },
}
</script>
