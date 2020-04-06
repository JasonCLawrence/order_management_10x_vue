<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-5 d-flex" />

        <modal :show.sync="addModal">
            <create-order-form @success="orderCreated" @cancel="hideModal()" />
        </modal>

        <modal :show.sync="importModal" modalClasses="invoice-import-modal">
            <import-invoices-form @success="hideImportModal()" @cancel="hideImportModal()" />
        </modal>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <order-table
                        title="Users"
                        @add="showModal"
                        @import="showImportModal()"
                        ref="table"
                    ></order-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import OrderTable from './OrderTable'
import CreateOrderForm from './CreateOrderForm'
import ImportInvoicesForm from './ImportInvoicesForm'

export default {
    name: 'orders',
    components: {
        OrderTable,
        CreateOrderForm,
        ImportInvoicesForm,
    },
    data: () => {
        return {
            addModal: false,
            importModal: false,
        }
    },

    methods: {
        hideModal() {
            this.addModal = false
        },
        showModal() {
            this.addModal = true
        },
        hideImportModal() {
            this.importModal = false
        },
        showImportModal() {
            this.importModal = true
        },
        orderCreated(data) {
            this.addModal = false
            this.$refs.table.doSearch()

            this.$swal({
                title: 'Order Created',
                type: 'success',
            }).then(() => {
                this.$router.push('/orders/' + data.id)
            })
        },
    },
}
</script>
<style>
.invoice-import-modal {
    max-width: 900px !important;
    max-height: 500px !important;
    margin-top: 8em;
}
</style>
