<template>
    <div class="mt--1 pb-4">
        <base-header class="pb-6 pb-8 pt-5 pt-md-8">
            <!-- Card stats -->
            <div class="row">
                <div class="col-xl-3 col-lg-6">
                    <router-link to="/users">
                        <stats-card
                            title="Users"
                            type="gradient-red"
                            :sub-title="users"
                            icon="ni ni-circle-08"
                            class="mb-4 mb-xl-0"
                        ></stats-card>
                    </router-link>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <router-link to="/fleet">
                        <stats-card
                            title="Fleet"
                            type="gradient-orange"
                            :sub-title="fleet"
                            icon="ni ni-delivery-fast"
                            class="mb-4 mb-xl-0"
                        ></stats-card>
                    </router-link>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <router-link to="/customers">
                        <stats-card
                            title="Customers"
                            type="gradient-green"
                            :sub-title="customers"
                            icon="ni ni-shop"
                            class="mb-4 mb-xl-0"
                        ></stats-card>
                    </router-link>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <router-link to="/warehouses">
                        <stats-card
                            title="Warehouses"
                            type="gradient-info"
                            :sub-title="warehouses"
                            icon="ni ni-shop"
                            class="mb-4 mb-xl-0"
                        ></stats-card>
                    </router-link>
                </div>
            </div>
        </base-header>

        <!--Charts-->
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-md-7 mb-5 mb-xl-0">
                    <card type="default" header-classes="bg-transparent">
                        <div slot="header" class="row align-items-center">
                            <div class="col">
                                <h6 class="text-uppercase text-muted ls-1 mb-1">Performance</h6>
                                <h5 class="h3 mb-0">Total Orders</h5>
                            </div>
                        </div>

                        <bar-chart :height="350" ref="barChart" :chart-data="chartData"></bar-chart>
                    </card>
                </div>

                <div class="col-md-5 mb-5 mb-xl-0">
                    <div class="card">
                        <div class="card-header border-0">
                            <div class="row align-items-center">
                                <div class="col">
                                    <h3 class="mb-0">Drivers Last Locations</h3>
                                </div>
                            </div>
                        </div>
                        <dashboard-map />
                    </div>
                </div>
            </div>

            <!-- Driver Map -->
            <!-- <div class="row">
                <div class="col-xl-12 mb-5 mb-xl-0 mt-5">
                    <div class="card">
                        <div class="card-header border-0">
                            <div class="row align-items-center">
                                <div class="col">
                                    <h3 class="mb-0">Drivers</h3>
                                </div>
                            </div>
                        </div>
                        <dashboard-map />
                    </div>
                </div>
            </div>-->

            <!--Tables-->
            <div class="row mt-5">
                <div class="col-xl-12 mb-5 mb-xl-0">
                    <recent-orders-table :orders="recentOrders" />
                </div>
            </div>
            <!--End tables-->
        </div>
    </div>
</template>
<script>
// Charts
import * as chartConfigs from '@/components/Charts/config'
import LineChart from '@/components/Charts/LineChart'
import BarChart from '@/components/Charts/BarChart'
import api from '@/api/dashboard'

// Tables
import SocialTrafficTable from './Dashboard/SocialTrafficTable'
import RecentOrdersTable from './Dashboard/RecentOrdersTable'

// Map
import DashboardMap from './Dashboard/DashboardMap'

export default {
    components: {
        LineChart,
        BarChart,
        RecentOrdersTable,
        SocialTrafficTable,
        DashboardMap,
    },
    data() {
        return {
            recentOrders: [],
            timeSeries: [],
            users: '0',
            orders: '0',
            warehouses: '0',
            customers: '0',
            fleet: '0',
            chartData: {
                labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Orders',
                        // data: [25, 20, 30, 22, 17, 29],
                    },
                ],
            },

            // map data
            zoom: 13,
            url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            popupData: "Hello I'm a Popup",
        }
    },
    methods: {
        setChartData(timeSeries) {
            //
            let shortMonths = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ]
            let labels = []
            let dataSet = []
            for (let entry of timeSeries) {
                labels.push(shortMonths[entry.month - 1])
                dataSet.push(entry.count)
            }

            // add extra empty months to fill the chart
            let lastEntryMonth = 0
            if (timeSeries.length > 0)
                lastEntryMonth = timeSeries[timeSeries.length - 1].month

            while (dataSet.length < 8) {
                lastEntryMonth = (lastEntryMonth + 1) % 12
                labels.push(shortMonths[lastEntryMonth])
                dataSet.push(0)
            }

            // set data
            this.chartData.labels = labels
            this.chartData.datasets[0].data = dataSet

            this.$refs.barChart.renderChart(this.chartData, null)
        },
    },
    mounted() {
        api.fetch().then(res => {
            const data = res.data.success.data

            // basics
            this.users = data.users.toString()
            this.fleet = data.fleet.toString()
            this.customers = data.customers.toString()
            this.warehouses = data.warehouses.toString()

            // chart
            this.timeSeries = data.time_series_orders
            this.setChartData(this.timeSeries)

            // calculate

            // orders
            let orders = data.most_recent_orders
            orders = orders.map(o => {
                // calculate task completion
                o.totalTasks = o.checklist.length
                o.completedTasks = o.checklist.filter(x => {
                    return x.checked == 1
                }).length

                if (o.totalTasks != 0)
                    o.taskCompletion = (o.completedTasks / o.totalTasks) * 100
                else o.taskCompletion = 0

                return o
            })

            this.recentOrders = orders
        })
    },
}
</script>
<style></style>
