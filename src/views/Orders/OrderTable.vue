<template>
    <div class="card shadow" :class="type === 'dark' ? 'bg-default': ''">
        <change-orders-driver
            ref="changeOrdersDriverDialog"
            :orders="checkedOrders"
            @success="bulkDriverSuccess()"
        />

        <change-orders-warehouse
            ref="changeOrdersWarehouseDialog"
            :orders="checkedOrders"
            @success="bulkWarehouseSuccess()"
        />

        <div class="card-header border-0" :class="type === 'dark' ? 'bg-transparent': ''">
            <div class="row">
                <div class="col-md-8">
                    <base-input
                        placeholder="Filter..."
                        addon-right-icon="ni ni-zoom-split-in"
                        v-model="query"
                        @input="updateQuery"
                    ></base-input>
                </div>
                <div class="col-md-2 text-right">
                    <base-button type="primary" block @click="$emit('add')">Create Order</base-button>
                </div>
                <div class="col-md-2 text-right">
                    <base-button type="primary" block @click="$emit('import')">Import Invoices</base-button>
                </div>
            </div>
            <div v-if="shouldShowFilters == false">
                <base-button size="sm" @click="showFilters()">show additional filters</base-button>
            </div>
            <template v-else>
                <query-filter ref="queryFilter" :model="filters" @input="filtersChanged" />
                <base-button size="sm" @click="hideFilters()">hide additional filters</base-button>
            </template>
        </div>

        <div
            class="bulk-actions"
            style="overflow:hidden;"
            v-show="this.checkedOrders.length>0 || true"
        >
            <div style="width:50%; float:left;">
                <span>Bulk Actions:</span>
                <br />
                <base-button
                    size="sm"
                    :disabled="this.checkedOrders.length==0"
                    @click="bulkSetDriver"
                >Set Driver</base-button>
                <base-button
                    size="sm"
                    :disabled="this.checkedOrders.length==0"
                    @click="bulkSetWarehouse"
                >Set Warehouse</base-button>
                <base-button
                    size="sm"
                    :disabled="this.checkedOrders.length==0"
                    @click="bulkSetIncomplete"
                >Set Incomplete</base-button>
                <base-button
                    size="sm"
                    :disabled="this.checkedOrders.length==0"
                    type="warning"
                    @click="bulkDelete"
                >Delete</base-button>
            </div>
            <div style="width:50%; float:left;overflow:hidden;text-align:right;">
                <span>Time:</span>
                <br />
                <base-button size="sm" @click="bulkSetDriver">Today</base-button>
                <base-button size="sm" @click="bulkSetWarehouse">Yesterday</base-button>
                <base-button size="sm" @click="bulkSetIncomplete">All</base-button>
            </div>
        </div>

        <div class="table-responsive">
            <!-- <div>
                <select v-model="bulkAction">
                    <option value="none" selected>Bulk Actions</option>
                    <option value="set_driver">Set Driver</option>
                    <option value="set_customer">Set Customer</option>
                    <option value="set_incomplete">Set Driver</option>
                </select>
                <base-button @click="applyBulkAction" :disabled="this.checkedOrders.length==0">Apply</base-button>
            </div>-->
            <base-table
                class="table align-items-center table-flush"
                :class="type === 'dark' ? 'table-dark': ''"
                :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
                tbody-classes="list"
                :data="orders"
            >
                <template slot="columns">
                    <th>
                        <!-- <input type="checkbox" @click="toggleChecked" /> -->
                        <base-checkbox :model="ordersMainCheck" @click="toggleChecked" />
                    </th>
                    <th>Invoice Number</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Type</th>
                    <th>Driver</th>
                    <th>Tasks</th>
                    <th>Warehouse Released</th>
                    <th>Completed</th>
                    <th>Actions</th>
                </template>

                <template slot-scope="{row}">
                    <td>
                        <!-- <input type="checkbox" v-model="row.checked" /> -->
                        <base-checkbox v-model="row.checked" />
                    </td>
                    <td>{{row.invoice_id}}</td>
                    <td>{{row.customer.name}}</td>
                    <td>${{currency(row.invoice_total)}}</td>
                    <td>{{row.type.toUpperCase()}}</td>

                    <td v-if="row.driver">{{row.driver.first_name}} {{ row.driver.last_name }}</td>
                    <td v-else>---</td>

                    <td v-if="row.type=='invoice'">
                        {{row.completedTasks}} / {{row.totalTasks}}
                        <base-progress
                            type="success"
                            :show-percentage="false"
                            class="pt-0"
                            :value="row.taskCompletion"
                        />
                    </td>
                    <td v-else></td>

                    <td>
                        <span v-if="row.warehouse_signed==1" class="text-success">RELEASED</span>
                        <span v-else class="text-danger">UNRELEASED</span>
                    </td>

                    <td>
                        <span v-if="row.completed" class="text-success">COMPLETE</span>
                        <span v-else class="text-danger">INCOMPLETE</span>
                    </td>

                    <td>
                        <base-button type="primary" @click="view(row.id)">Edit</base-button>
                        <base-button type="danger" @click="deleteItem(row.id)">Delete</base-button>
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
                @input="changePage"
            ></base-pagination>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import QueryFilter from './QueryFilter.vue'
import ChangeOrdersDriver from './ChangeOrdersDriver.vue'
import ChangeOrdersWarehouse from './ChangeOrdersWarehouse.vue'

export default {
    name: 'fleet-table',
    components: { QueryFilter, ChangeOrdersDriver, ChangeOrdersWarehouse },
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
            shouldShowFilters: false,
            filters: {},
            bulkAction: 'none',
            ordersMainCheck: false,
        }
    },

    mounted() {
        if (this.$route.query.query) this.query = this.$route.query.query
        this.doSearch()
    },

    methods: {
        bulkSetDriver() {
            this.$refs.changeOrdersDriverDialog.show()
        },
        bulkDriverSuccess() {
            this.doSearch()
            this.ordersMainCheck = false
        },
        bulkSetWarehouse() {
            this.$refs.changeOrdersWarehouseDialog.show()
        },
        bulkWarehouseSuccess() {
            this.doSearch()
            this.ordersMainCheck = false
        },
        bulkDriverError() {},
        bulkSetIncomplete() {
            this.$swal
                .fire({
                    title: 'Mark Orders as Complete?',
                    text: `Are you sure you want to mark these orders as complete?`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                })
                .then(result => {
                    if (result.value) {
                        this.$store
                            .dispatch('orders/bulkSetIncomplete', {
                                orders: this.checkedOrders,
                            })
                            .then(x => {
                                this.$swal.fire(
                                    'Success!',
                                    'Selected orders were marked as complete',
                                    'success'
                                )

                                this.ordersMainCheck = false
                                this.doSearch()
                            })
                            .catch(x => {
                                this.$swal.fire(
                                    'Error!',
                                    'There was an error marking orders as complete',
                                    'error'
                                )
                            })
                    }
                })
        },
        bulkDelete() {
            this.$swal
                .fire({
                    title: 'Delete Orders?',
                    text: `Are you sure you want to delete these orders?`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                })
                .then(result => {
                    if (result.value) {
                        this.$store
                            .dispatch('orders/bulkDelete', {
                                orders: this.checkedOrders,
                            })
                            .then(x => {
                                this.$swal.fire(
                                    'Success!',
                                    'Selected orders were deleted',
                                    'success'
                                )

                                this.doSearch()
                            })
                            .catch(x => {
                                this.$swal.fire(
                                    'Error!',
                                    'Error deleting selected orders',
                                    'error'
                                )
                            })

                        this.ordersMainCheck = false
                    }
                })
        },
        toggleChecked() {
            // if there's a checked item then check the rest
            if (this.checkedOrders.length != this.orders.length) {
                this.checkAllItems()
            } else {
                // if all are checked, then uncheck them
                this.unCheckAllItems()
            }
        },
        checkAllItems() {
            for (let order of this.orders) {
                order.checked = true
            }
        },
        unCheckAllItems() {
            for (let order of this.orders) {
                order.checked = false
            }
        },
        applyBulkAction() {},
        showFilters() {
            this.shouldShowFilters = true
            return false
        },
        hideFilters() {
            this.shouldShowFilters = false
            return false
        },
        updateQuery: _.debounce(function(query) {
            this.query = query
            this.$router.push({ query: { query: this.query } })
            this.doSearch()
        }, 200),
        changePage: function(page) {
            this.page = page
            this.$router.push({
                query: { page: page, query: this.query, ...this.filters },
            })
            this.doSearch()
        },
        doSearch() {
            this.$store.dispatch('orders/fetch', {
                query: this.query,
                filters: this.filters,
                page: this.page,
            })
        },
        filtersChanged(filters) {
            // requery
            console.log('filters changed')
            this.filters = filters
            this.doSearch()
        },
        view(index) {
            this.$router.push({ path: `orders/${index}` })
        },
        deleteItem(id) {
            let item = this.orders.find(el => el.id == id)

            this.$swal
                .fire({
                    title: 'Delete Order?',
                    text: `Are you sure you want to delete this order?`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                })
                .then(result => {
                    if (result.value) {
                        this.$store
                            .dispatch('orders/delete', id)
                            .then(x => {
                                this.$swal.fire(
                                    'Deleted!',
                                    'Your order has been deleted.',
                                    'success'
                                )
                            })
                            .catch(x => {
                                this.$swal.fire(
                                    'Error!',
                                    'Unable to delete order!',
                                    'error'
                                )
                            })
                    }
                })
        },
        currency(num) {
            return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        },
    },

    computed: {
        checkedOrders() {
            return this.$store.state.orders.items.filter(x => x.checked == true)
        },
        orders() {
            return this.$store.state.orders.items
        },
        pagination() {
            return this.$store.state.orders.pagination
        },
    },

    watch: {
        filters: {
            handler() {
                console.log('doing search')
                this.doSearch()
            },
            deep: true,
        },
    },
}
</script>
<style>
.bulk-actions {
    vertical-align: middle;
    padding: 0.7rem 1.5rem;
    background: #f6f9fc;
    border-top: solid 1px #e9ecef;
}

.bulk-actions span {
    margin-right: 1rem;
}
</style>
