<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-5 d-flex" />

        <div class="container-fluid mt--7 pb-4">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">
                                        Order
                                        <span>{{ this.basicsModel.complete?"(complete)":"(incomplete)" }}</span>
                                    </h3>
                                </div>
                                <div class="col-4 text-right">
                                    <base-button
                                        @click="downloadSummary()"
                                        :disabled="updating"
                                    >Download Summary</base-button>
                                    <base-button
                                        @click="toggleCompletion()"
                                        :disabled="updating"
                                    >{{ this.basicsModel.complete?"Mark as Incomplete":"Mark as Complete" }}</base-button>
                                </div>
                            </div>
                        </div>
                        <template>
                            <div class="pl-lg-4">
                                <h6 class="heading-small text-muted mb-4">Basics</h6>
                                <form @submit.prevent="update()">
                                    <div class="row">
                                        <div class="col-lg-8">
                                            <div class="form-group">
                                                <label class="form-control-label">Driver</label>
                                                <div class="has-label">
                                                    <select
                                                        class="form-control"
                                                        v-model="basicsModel.driver_id"
                                                    >
                                                        <option
                                                            v-for="(driver, key) in drivers"
                                                            :value="driver.id"
                                                            :key="key"
                                                        >{{driver.first_name}} {{driver.last_name}}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-8">
                                            <div class="form-group">
                                                <label class="form-control-label">Customer</label>
                                                <div class="has-label">
                                                    <select
                                                        class="form-control"
                                                        v-model="basicsModel.customer_id"
                                                    >
                                                        <option
                                                            v-for="(el, key) in customers"
                                                            :value="el.id"
                                                            :key="key"
                                                        >{{el.name}}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-8">
                                            <div class="form-group">
                                                <label class="form-control-label">Warehouse</label>
                                                <div class="has-label">
                                                    <select
                                                        class="form-control"
                                                        v-model="basicsModel.warehouse_id"
                                                    >
                                                        <option
                                                            v-for="(el, key) in warehouses"
                                                            :value="el.id"
                                                            :key="key"
                                                        >{{el.name}}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-8">
                                            <div class="form-group">
                                                <label class="form-control-label">Description</label>
                                                <div class="has-label">
                                                    <textarea
                                                        class="form-control"
                                                        rows="3"
                                                        placeholder="Small description of order..."
                                                        name="description"
                                                        v-model="basicsModel.description"
                                                        :error="errors.first('description')"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Empty col as passing for row -->
                                        <div class="col-lg-4"></div>

                                        <div class="col-lg-4">
                                            <base-input label="Date">
                                                <flat-picker
                                                    slot-scope="{focus, blur}"
                                                    @on-open="focus"
                                                    @on-close="blur"
                                                    :config="{allowInput: true}"
                                                    class="form-control datepicker"
                                                    v-model="basicsModel.date"
                                                ></flat-picker>
                                            </base-input>
                                        </div>

                                        <div class="col-lg-4">
                                            <base-input
                                                label="Time"
                                                :error="errors.first('time')"
                                                v-validate="'required'"
                                                name="time"
                                            >
                                                <flat-picker
                                                    slot-scope="{focus, blur}"
                                                    @on-open="focus"
                                                    @on-close="blur"
                                                    :config="{enableTime: true,noCalendar: true,dateFormat: 'H:i:ss'}"
                                                    class="form-control datepicker"
                                                    v-model="basicsModel.time"
                                                ></flat-picker>
                                            </base-input>
                                        </div>

                                        <div class="col-lg-8">
                                            <base-input
                                                label="Address"
                                                placeholder="Doe"
                                                v-model="basicsModel.address"
                                                :error="errors.first('address')"
                                                name="address"
                                            />
                                        </div>
                                        <div class="col-lg-8">
                                            <location-picker v-model="basicsModel.location" />
                                        </div>

                                        <div class="col-lg-8">
                                            <base-checkbox
                                                v-model="basicsModel.signature"
                                            >Require Signature</base-checkbox>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-12">
                                            <base-button
                                                type="primary"
                                                @click="update()"
                                                class="float-right"
                                                :disabled="updating?true:false"
                                            >{{ updating?"Saving Changes...":"Save Changes" }}</base-button>
                                        </div>
                                    </div>
                                </form>
                                <template v-if="basicsModel.signature">
                                    <hr />
                                    <signature :order="basicsModel" />
                                </template>

                                <hr />
                                <warehouse-signature :order="basicsModel" />

                                <hr />
                                <tasks ref="tasks" />

                                <hr />
                                <invoice ref="invoice" />
                                <hr />
                                <notes :order="basicsModel" />
                                <hr />
                                <attachments :order="basicsModel" />
                                <!-- <notes /> -->
                            </div>
                        </template>
                    </card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/order'
import flatPicker from 'vue-flatpickr-component'
import tasks from './Tasks.vue'
import invoice from './Invoice.vue'
import notes from './Notes.vue'
import attachments from './Attachments.vue'
import signature from './Signature.vue'
import warehouseSignature from './WarehouseSignature.vue'
import LocationPicker from '@/components/Map/LocationPicker'

export default {
    name: 'view-order',
    components: {
        flatPicker,
        tasks,
        invoice,
        notes,
        LocationPicker,
        attachments,
        signature,
        warehouseSignature,
    },
    data() {
        return {
            basicsModel: {
                /* other props go gere */
                notes: [
                    {
                        content: 'Simple item task...',
                    },
                ],
            },
            basicsModelHash: '',
            tasksModel: {},
            invoiceModel: {},
            tasks: [
                // {
                //     checked: true,
                //     name: 'Simple item task...',
                //     deleted: false,
                // },
            ],
            invoiceItems: [
                // {
                //     item: 'Sample Item',
                //     quantity: 0,
                //     price: 0,
                //     deleted: false,
                // },
            ],

            updating: false,
            submittingTasks: false,
            drivers: [],
            warehouses: [],
            customers: [],
        }
    },
    methods: {
        downloadSummary() {
            api.downloadSummary(this.orderId)
        },
        updated() {
            console.log(this.basicsModel)
        },
        update() {
            // this.basicsModel.schedule_at =
            //     this.basicsModel.date + ' ' + this.basicsModel.time + ':00'

            // this.basicsModel.lat = this.basicsModel.location.lat
            // this.basicsModel.long = this.basicsModel.location.lng

            // let model = JSON.parse(JSON.stringify(this.basicsModel))

            // model.signature = model.signature ? 1 : 0

            let model = this.getModel()

            this.updating = true

            api.update(this.$route.params.id, model)
                .then(result => {
                    this.$swal({
                        title: 'Order Updated!',
                        type: 'success',
                    })
                    let model = result.data.success.data

                    // split scheduled_at into date and time
                    const time = model.schedule_at.split(' ')
                    model.date = time[0]
                    model.time = time[1]

                    model.completed = model.completed === 1
                    model.signature = model.signature === 1

                    model.location = new L.latLng(
                        model.lat ? model.lat : 0,
                        model.long ? model.long : 0
                    )

                    this.basicsModel = model

                    this.hashBasicsModel()
                })
                .catch(error => {
                    this.$swal({
                        title: 'Error Updating Order!',
                        type: 'error',
                    })
                })
                .finally(() => {
                    this.updating = false
                })
        },
        currency(num) {
            return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        },
        toggleCompletion() {
            // this.markAsIncomplete()
            if (this.basicsModel.complete) {
                this.markAsIncomplete()
            } else {
                this.markAsComplete()
            }
        },
        markAsComplete() {
            this.$swal
                .fire({
                    title: 'Mark as Complete?',
                    text: `Are you sure you want to mark this order as complete?`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                })
                .then(result => {
                    if (!result.value) return

                    this.updating = true
                    api.markAsComplete(this.$route.params.id)
                        .then(res => {
                            this.$swal({
                                title: 'Order Completed!',
                                type: 'success',
                            })
                            this.basicsModel.complete = true
                        })
                        .catch(error => {
                            this.$swal({
                                title: 'Error Marking as Complete!',
                                type: 'error',
                            })
                        })
                        .finally(() => {
                            this.updating = false
                        })
                })
        },
        markAsIncomplete() {
            this.$swal
                .fire({
                    title: 'Mark as Incomplete?',
                    text: `Are you sure you want to mark this order as incomplete?`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                })
                .then(result => {
                    if (!result.value) return

                    this.updating = true
                    api.markAsIncomplete(this.$route.params.id)
                        .then(res => {
                            this.$swal({
                                title: 'Order Set As Incompleted!',
                                type: 'success',
                            })
                            this.basicsModel.complete = false
                            this.hashBasicsModel()
                        })
                        .catch(error => {
                            this.$swal({
                                title: 'Error Marking as Complete!',
                                type: 'error',
                            })
                        })
                        .finally(() => {
                            this.updating = false
                        })
                })
        },
        getModel() {
            if (this.basicsModel == null) return null

            let m = JSON.parse(JSON.stringify(this.basicsModel))

            let model = {}
            model.customer_id = m.customer_id
            model.driver_id = m.driver_id
            model.warehouse_id = m.warehouse_id
            model.description = m.description == '' ? null : m.description
            model.address = m.address == '' ? null : m.address
            model.schedule_at = m.date + ' ' + m.time // + ':00'

            if (m.location) {
                model.lat = m.location.lat
                model.long = m.location.lng
            }

            model.signature = m.signature ? 1 : 0

            return model
        },
        getModelHash() {
            return JSON.stringify(this.getModel())
        },
        hashBasicsModel() {
            // create hash
            this.basicsModelHash = this.getModelHash()
        },
        hasBasicModelChanged() {
            let hash = this.getModelHash()
            // console.log(hash)
            // console.log(this.basicsModelHash)
            if (this.basicsModelHash != hash) return true
            return false
        },
        hasTasksModelChanged() {},
        hasInvoiceModelChanged() {},
    },
    mounted() {
        api.fetchById(this.$route.params.id).then(result => {
            let model = result.data.success.data

            // split scheduled_at into date and time
            const time = model.schedule_at.split(' ')
            model.date = time[0]
            model.time = time[1]

            model.complete = model.completed === 1
            model.signature = model.signature === 1

            model.location = new L.latLng(
                model.lat ? model.lat : 0,
                model.long ? model.long : 0
            )

            this.basicsModel = model
            this.hashBasicsModel()
        })

        api.fetchTasks(this.$route.params.id).then(result => {
            let tasks = result.data.success.data
            this.tasks = tasks
        })

        api.fetchDrivers().then(result => {
            let drivers = result.data.success.data

            this.drivers = drivers
        })

        api.fetchWarehouses().then(result => {
            let warehouses = result.data.success.data
            this.warehouses = warehouses
        })

        api.fetchCustomers().then(result => {
            let customers = result.data.success.data
            this.customers = customers
        })
    },

    computed: {
        complete() {
            return this.basicsModel.complete
        },
        orderId() {
            return this.$route.params.id
        },
    },
    beforeRouteLeave(to, from, next) {
        // check basic model
        if (this.hasBasicModelChanged()) {
            let answer = window.confirm(
                'Do you really want to leave? you have unsaved changes!'
            )
            if (answer) {
                next()
            } else {
                next(false)
            }
            return
        }

        // check tasks
        if (this.$refs.tasks.hasUnsavedChanges()) {
            let answer = window.confirm(
                'Do you really want to leave? you have unsaved changes to your tasks!'
            )
            if (answer) {
                next()
            } else {
                next(false)
            }
            return
        }

        // check invoice
        if (this.$refs.invoice) {
            if (this.$refs.invoice.hasUnsavedChanges()) {
                let answer = window.confirm(
                    'Do you really want to leave? You have unsaved changes to your invoice items!'
                )
                if (answer) {
                    next()
                } else {
                    next(false)
                }
                return
            }
        }

        next()

        // if (hasChanges) {
        //     next()
        // } else {
        //     next(false)
    },
}
</script>
<style>
.deleted-task {
    color: red;
    text-decoration: line-through;
}
</style>
