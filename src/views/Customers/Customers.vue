<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-5 d-flex" />

        <modal :show.sync="addModal">
            <create-customer-form @success="customerCreated" ref="modal" @cancel="hideModal()"></create-customer-form>
        </modal>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <customer-table title="Warehouse" @add="showAddModal()" ref="table"></customer-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CustomerTable from './CustomerTable'
import CreateCustomerForm from './CreateCustomerForm'

export default {
    name: 'customers',
    components: {
        CustomerTable,
        CreateCustomerForm,
    },
    data: () => {
        return {
            addModal: false,
        }
    },

    methods: {
        hideModal() {
            this.addModal = false
        },
        showAddModal() {
            this.addModal = true
        },
        customerCreated() {
            this.addModal = false
            this.$swal({
                title: 'Customer Created',
                type: 'success',
            })

            this.$refs.table.doSearch()
        },
    },
}
</script>
<style></style>
