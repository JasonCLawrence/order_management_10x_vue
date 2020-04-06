<template>
    <div class="card shadow" :class="type === 'dark' ? 'bg-default': ''">
        <!-- Details Dialog -->
        <export-details-dialog ref="detailsDialog" @download="exportReportDetails()" />
        <div class="card-header border-0" :class="type === 'dark' ? 'bg-transparent': ''">
            <div class="row">
                <div class="col-md-2">
                    <div class="form-group">
                        <label class="form-control-label">Customer</label>
                        <div class="has-label">
                            <select class="form-control" v-model="model.customer_id">
                                <option value="0" default>Any</option>
                                <option
                                    v-for="(el, key) in customers"
                                    :value="el.id"
                                    :key="key"
                                >{{el.name}}</option>
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
                                <option :value="-1">Assigned</option>
                                <option :value="-2">Unassigned</option>
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

            <div class="row">
                <div class="col-md-8"></div>
                <div class="col-md-4" style="text-align:right">
                    <base-button type="primary" @click="exportReport()">Export Header</base-button>
                    <base-button type="primary" @click="showDetailsDialog()">Export Details</base-button>
                </div>
            </div>
        </div>

        <div class="table-responsive">
            <base-table
                class="table align-items-center table-flush"
                :class="type === 'dark' ? 'table-dark': ''"
                :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
                tbody-classes="list"
                :data="report"
            >
                <template slot="columns">
                    <th>Customer</th>
                    <th>Driver</th>
                    <th>Warehouse</th>
                    <th>Type</th>
                    <th>Completed</th>
                    <th>Created By</th>
                    <th>Created At</th>
                </template>

                <template slot-scope="{row}">
                    <th scope="row">
                        <div class>
                            <span class="name mb-0 text-sm">{{row.customer}}</span>
                        </div>
                    </th>

                    <td>
                        <span>{{row.driver}}</span>
                    </td>

                    <td>
                        <span>{{row.warehouse}}</span>
                    </td>

                    <td>
                        <span>{{row.type}}</span>
                    </td>
                    <td>
                        <span>{{row.completed}}</span>
                    </td>

                    <td>
                        <span>{{row.created_by}}</span>
                    </td>

                    <td>
                        <span>{{row.created_at}}</span>
                    </td>
                </template>
            </base-table>
        </div>

        <div
            class="card-footer d-flex justify-content-end"
            :class="type === 'dark' ? 'bg-transparent': ''"
        >
            <base-pagination
                v-if="pagination!=null"
                :perPage="pagination.pageSize"
                :value="pagination.page"
                :total="pagination.total"
            ></base-pagination>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import api from '@/api/report'
import flatPicker from 'vue-flatpickr-component'
import moment from 'moment'
import ExportDetailsDialog from './ExportDetailsDialog'

//https://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
function pad(num, size) {
    var s = num + ''
    while (s.length < size) s = '0' + s
    return s
}

// https://stackoverflow.com/questions/13571700/get-first-and-last-date-of-current-month-with-javascript-or-jquery
// function monthStart() {
//     var date = new Date(),
//         y = date.getFullYear(),
//         m = date.getMonth()
//     var dateObj = new Date(y, m, 1)
//     var month = dateObj.getUTCMonth() + 1
//     var day = dateObj.getUTCDate()
//     var year = dateObj.getUTCFullYear()

//     const date = year + '-' + pad(month, 2) + '-' + pad(day, 2)
//     return date
// }

// function monthEnd() {
//     var date = new Date(),
//         y = date.getFullYear(),
//         m = date.getMonth()
//     var dateObj = new Date(y, m + 1, 0)
//     var month = dateObj.getUTCMonth() + 1
//     var day = dateObj.getUTCDate()
//     var year = dateObj.getUTCFullYear()

//     const date = year + '-' + pad(month, 2) + '-' + pad(day, 2)
//     return date
// }

export default {
    components: { flatPicker, ExportDetailsDialog },
    name: 'reports-table',
    props: {
        type: {
            type: String,
        },
        title: String,
    },
    data() {
        return {
            query: '',
            page: 1,
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
        this.fetchReport()

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
        fetchReport() {
            this.$store.dispatch('report/fetch', this.queryModel)
        },
        exportReport() {
            api.downloadReport(this.queryModel)

            // api.fetchReportExcel(this.queryModel).then(data => {
            //     const blob = new Blob([data], { type: 'application/xlsx' })
            //     const url = window.URL.createObjectURL(blob)

            //     var a = document.createElement('a')
            //     document.body.appendChild(a)
            //     a.style.display = 'none'

            //     a.href = url
            //     a.download = 'Report.xlsx'
            //     a.click()
            //     window.URL.revokeObjectURL(url)
            // })
        },
        showDetailsDialog() {
            this.$refs.detailsDialog.show(this.queryModel)
        },
        exportReportDetails() {
            api.downloadReportDetails(this.queryModel)
        },
    },

    computed: {
        report() {
            return this.$store.state.report.items
        },
        pagination() {
            return this.$store.state.report.pagination
        },
        queryModel() {
            return {
                ...this.model,
                completed:
                    this.model.completed == 'any'
                        ? null
                        : this.model.completed == 'yes'
                        ? 1
                        : 0,
                type: this.model.type == 'any' ? null : this.model.type,
            }
        },
    },

    watch: {
        model: {
            handler() {
                this.fetchReport()
            },
            deep: true,
        },
        // queryModel() {
        //     this.fetchReport()
        // },
    },
}
</script>
<style>
</style>
