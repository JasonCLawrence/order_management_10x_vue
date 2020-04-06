<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-5 d-flex" />

        <modal :show.sync="addUserModal">
            <create-user-form @success="userCreated()" @cancel="hideModal()"></create-user-form>
        </modal>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <users-table title="Users" @addUser="showUserModal()" ref="userTable"></users-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import UsersTable from './Users/UsersTable'
import CreateUserForm from './Users/CreateUserForm'

export default {
    name: 'tables',
    components: {
        UsersTable,
        CreateUserForm,
    },
    data: () => {
        return {
            addUserModal: false,
        }
    },

    methods: {
        hideModal() {
            this.addUserModal = false
        },
        showUserModal() {
            this.addUserModal = true
        },
        userCreated() {
            this.$swal({
                title: 'User Created',
                type: 'success',
            })

            this.addUserModal = false
            this.$refs.userTable.doSearch()
        },
    },

    mounted() {},
}
</script>
<style></style>
