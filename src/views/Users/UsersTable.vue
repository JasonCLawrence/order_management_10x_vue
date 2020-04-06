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
                    <base-button type="primary" @click="$emit('addUser')">Add User</base-button>
                </div>
            </div>
        </div>

        <div class="table-responsive">
            <base-table
                class="table align-items-center table-flush"
                :class="type === 'dark' ? 'table-dark': ''"
                :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
                tbody-classes="list"
                :data="users"
            >
                <template slot="columns">
                    <th>Name</th>
                    <th>Roles</th>
                    <th>Email</th>
                    <th>Actions</th>
                </template>

                <template slot-scope="{row}">
                    <th scope="row">
                        <div class="media align-items-center">
                            <!-- <a href="#" class="avatar rounded-circle mr-3">
                <img alt="Image placeholder" :src="row.img" />
                            </a>-->
                            <div class="media-body">
                                <span class="name mb-0 text-sm">{{row.firstName}} {{row.lastName}}</span>
                            </div>
                        </div>
                    </th>
                    <td>
                        <badge class="badge-dot mr-4" type="success">
                            <span
                                v-for="(role, index) in row.roles"
                                class="status text-left text-uppercase"
                                :key="index"
                            >
                                {{role.role.name}}
                                <br />
                            </span>
                        </badge>
                    </td>

                    <td>
                        <div class="d-flex align-items-center">{{row.email}}</div>
                    </td>

                    <td>
                        <div class="d-flex align-items-center">
                            <div>
                                <base-button type="primary" @click="viewUser(row.id)">Edit</base-button>
                                <base-button type="danger" @click="deleteUser(row.id)">Delete</base-button>
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
import mapGetters from 'vuex'
import _ from 'lodash'

export default {
    name: 'users-table',
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
        //this.$router.push({ query: this.query })
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
            this.$store.dispatch('fetchUsers', {
                query: this.query,
                page: this.page,
            })
        },
        viewUser(index) {
            this.$router.push({ path: `users/${index}` })
        },
        deleteUser(id) {
            // console.log(id)
            // console.log(this.users)
            let user = this.users.find(el => el.id == id)
            // this.$swal.fire({
            //     title: 'Delete User',
            //     confirmButtonText: 'Delete',
            //     showCancelButton: true,
            //     text: `Are you sure you want to delete ${user.firstName}?`,
            //     showLoaderOnConfirm: true,
            // })

            this.$swal
                .fire({
                    title: 'Delete User?',
                    text: `Are you sure you want to delete ${user.firstName}?`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                })
                .then(result => {
                    if (result.value) {
                        this.$store
                            .dispatch('delete_user', id)
                            .then(x => {
                                this.$swal.fire(
                                    'Deleted!',
                                    'Your file has been deleted.',
                                    'success'
                                )
                            })
                            .catch(x => {
                                this.$swal.fire(
                                    'Error!',
                                    'Unable to delete user!',
                                    'error'
                                )
                            })
                    }
                })
        },
    },

    computed: {
        users() {
            return this.$store.state.users.users
        },
        pagination() {
            return this.$store.state.users.pagination
        },
    },
}
</script>
<style>
</style>
