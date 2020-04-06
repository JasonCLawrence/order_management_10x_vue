<template>
    <div class="row">
        <div class="col-md-2">
            <div class="form-group">
                <label class="form-control-label">Customer</label>
                <div class="has-label">
                    <select class="form-control" v-model="model.customer_id">
                        <option value="0" default>Any</option>
                        <option v-for="(el, key) in customers" :value="el.id" :key="key">{{el.name}}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="form-group">
                <label class="form-control-label">Warehouse</label>
                <div class="has-label">
                    <select class="form-control" v-model="model.warehouse_id">
                        <option :value="0">Any</option>
                        <option
                            v-for="(el, key) in warehouses"
                            :value="el.id"
                            :key="key"
                        >{{el.name}}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="form-group">
                <label class="form-control-label">Driver</label>
                <div class="has-label">
                    <select class="form-control" v-model="model.driver_id">
                        <option :value="0">Any</option>
                        <option
                            v-for="(driver, key) in drivers"
                            :value="driver.id"
                            :key="key"
                        >{{driver.first_name}} {{driver.last_name}}</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="col-md-2">
            <base-input label="Start Date">
                <flat-picker
                    slot-scope="{focus, blur}"
                    @on-open="focus"
                    @on-close="blur"
                    :config="{allowInput: true}"
                    class="form-control datepicker"
                    v-model="model.created_start"
                ></flat-picker>
            </base-input>
        </div>
        <div class="col-md-2">
            <base-input label="End Date">
                <flat-picker
                    slot-scope="{focus, blur}"
                    @on-open="focus"
                    @on-close="blur"
                    :config="{allowInput: true}"
                    class="form-control datepicker"
                    v-model="model.created_end"
                ></flat-picker>
            </base-input>
        </div>
        <div class="col-md-1">
            <div class="form-group">
                <label class="form-control-label">Type</label>
                <div class="has-label">
                    <select id="make" name="type" class="form-control" v-model="model.type">
                        <option value="any">All</option>
                        <option value="service">Service</option>
                        <option value="invoice">Invoice</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col-md-1">
            <div class="form-group">
                <label class="form-control-label">Completed</label>
                <div class="has-label">
                    <select
                        id="completed"
                        name="type"
                        class="form-control"
                        v-model="model.completed"
                    >
                        <option value="any">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
            </div>
        </div>
        <!-- <div class="col-md-1">
                    <label class="form-control-label">&nbsp;</label>
                    <br />
                    <base-button type="primary" @click="fetchReport()">Generate</base-button>
        </div>-->
    </div>
</template>

<script>
import api from '@/api/report'
import flatPicker from 'vue-flatpickr-component'
import moment from 'moment'

export default {
    components: { flatPicker },
    name: 'reports-table',
    props: ['value'],
    data() {
        return {
            model: {
                driver_id: 0,
                customer_id: 0,
                warehouse_id: 0,
                completed: 'any',
                type: 'any',
                created_start: moment()
                    .startOf('month')
                    .format('YYYY-MM-DD'),
                created_end: moment()
                    .endOf('month')
                    .format('YYYY-MM-DD'),
            },
            drivers: [],
            customers: [],
            warehouses: [],
        }
    },
    mounted() {
        api.fetchDrivers().then(result => {
            let drivers = result.data.success.data.data

            drivers = drivers.filter(x => {
                let res =
                    x.roles.findIndex(r => {
                        return r.role.name == 'driver'
                    }) !== -1
                return res
            })
            this.drivers = drivers
        })

        api.fetchWarehouses().then(result => {
            let warehouses = result.data.success.data.data
            this.warehouses = warehouses
        })

        api.fetchCustomers().then(result => {
            let customers = result.data.success.data.data
            this.customers = customers
        })
    },
    methods: {
        getFilters() {
            return this.model
        },
    },
    watch: {
        model: {
            handler() {
                console.log('emitting change')
                console.log(this.model)
                this.$emit('input', this.model)
            },
            deep: true,
        },
    },
}
</script>