<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-5 d-flex" />

        <modal :show.sync="addModal" :showClose="true">
            <create-warehouse-form ref="modal" @success="warehouseCreated" @cancel="hideModal()"></create-warehouse-form>
        </modal>

        <div class="container-fluid mt--7 pb-4">
            <div class="row">
                <div class="col">
                    <warehouse-table title="Warehouse" @add="showAddModal()" ref="table"></warehouse-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import WarehouseTable from './WarehouseTable'
import CreateWarehouseForm from './CreateWarehouseForm'

export default {
    name: 'tables',
    components: {
        WarehouseTable,
        CreateWarehouseForm,
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
            this.$refs.modal.invalidateMap()
            //this.$refs.map.mapObject.invalidateSize()
        },
        warehouseCreated() {
            this.addModal = false
            this.$swal({
                title: 'Warehouse Created',
                type: 'success',
            })

            this.$refs.table.doSearch()
        },
    },
}
</script>
<style></style>
