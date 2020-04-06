<template>
    <div class="card">
        <div class="card-header border-0">
            <div class="row align-items-center">
                <div class="col">
                    <h3 class="mb-0">Recent Orders</h3>
                </div>
                <div class="col text-right">
                    <a href="#/orders" class="btn btn-sm btn-primary">See all</a>
                </div>
            </div>
        </div>

        <div class="table-responsive">
            <base-table thead-classes="thead-light" :data="orders">
                <template slot="columns">
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Driver</th>
                    <th>Tasks</th>
                </template>

                <template slot-scope="{row}">
                    <th scope="row">{{row.customer.name}}</th>
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
                </template>
            </base-table>
        </div>
    </div>
</template>
<script>
import api from '@/api/order'

export default {
    name: 'recent-orders-table',
    props: ['orders'],
    data() {
        return {}
    },

    mounted() {
        // api.fetch().then(res => {
        //     let orders = res.data.success.data
        //     this.orders = orders
        // })
        // console.log(this.orders)
    },

    computed: {
        orderList() {
            return this.orders ? this.orders : []
        },
    },
}
</script>
<style>
</style>
