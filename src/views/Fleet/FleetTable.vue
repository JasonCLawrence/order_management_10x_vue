<template>
    <div class="card shadow" :class="type === 'dark' ? 'bg-default': ''">
        <div class="card-header border-0" :class="type === 'dark' ? 'bg-transparent': ''">
            <div class="row">
                <div class="col-md-10">
                    <base-input
                        placeholder="Filter..."
                        addon-right-icon="ni ni-zoom-split-in"
                        v-model="query"
                        @input="updateQuery"
                    ></base-input>
                </div>
                <div class="col text-right">
                    <base-button type="primary" @click="$emit('addVehicle')">Add Vehicle</base-button>
                </div>
            </div>
        </div>

        <div class="table-responsive">
            <base-table
                class="table align-items-center table-flush"
                :class="type === 'dark' ? 'table-dark': ''"
                :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
                tbody-classes="list"
                :data="fleet"
            >
                <template slot="columns">
                    <th>Name</th>
                    <th>Model</th>
                    <th>Registration</th>
                    <th>Description</th>
                    <th>Actions</th>
                </template>

                <template slot-scope="{row}">
                    <th scope="row">
                        <div class="media align-items-center">
                            <div class="media-body">
                                <span class="name mb-0 text-sm">{{row.name}}</span>
                            </div>
                        </div>
                    </th>

                    <td>
                        <div class="d-flex align-items-center">
                            <span>{{row.model}}</span>
                        </div>
                    </td>

                    <td>
                        <badge class="badge-dot mr-4">{{row.registration}}</badge>
                    </td>

                    <td>{{ truncate(row.description, 30) }}</td>

                    <td>
                        <div class="d-flex align-items-center">
                            <div>
                                <base-button type="primary" @click="view(row.id)">Edit</base-button>
                                <base-button type="danger" @click="deleteItem(row.id)">Delete</base-button>
                            </div>
                        </div>
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

export default {
    name: 'fleet-table',
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
        }
    },

    mounted() {
        if (this.$route.query.query) this.query = this.$route.query.query
        this.doSearch()
    },

    methods: {
        updateQuery: _.debounce(function(query) {
            this.query = query
            this.$router.push({ query: { query: this.query } })
            this.doSearch()
        }, 200),
        changePage: function(page) {
            this.page = page
            this.$router.push({ query: { page: page } })
            this.doSearch()
        },
        doSearch() {
            this.$store.dispatch('fleet/fetch', {
                query: this.query,
                page: this.page,
            })
        },
        view(index) {
            this.$router.push({ path: `fleet/${index}` })
        },
        deleteItem(id) {
            let item = this.fleet.find(el => el.id == id)

            this.$swal
                .fire({
                    title: 'Delete Vehicle?',
                    text: `Are you sure you want to delete ${item.name}?`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                })
                .then(result => {
                    if (result.value) {
                        this.$store
                            .dispatch('fleet/delete', id)
                            .then(x => {
                                this.$swal.fire(
                                    'Deleted!',
                                    'Your vehicle has been deleted.',
                                    'success'
                                )
                            })
                            .catch(x => {
                                this.$swal.fire(
                                    'Error!',
                                    'Unable to delete vehicle!',
                                    'error'
                                )
                            })
                    }
                })
        },

        truncate(text, length) {
            return _.truncate(text, { length: length })
        },
    },

    computed: {
        fleet() {
            return this.$store.state.fleet.items
        },
        pagination() {
            return this.$store.state.fleet.pagination
        },
    },
}
</script>
<style>
</style>
