<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-5 d-flex" />

        <modal :show.sync="addModal">
            <create-vehicle-form @success="created" @cancel="hideModal()"></create-vehicle-form>
        </modal>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <fleet-table title="Users" @addVehicle="showVehicleModal" ref="table"></fleet-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import FleetTable from './FleetTable'
import CreateVehicleForm from './CreateVehicleForm'

export default {
    name: 'tables',
    components: {
        FleetTable,
        CreateVehicleForm,
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
        showVehicleModal() {
            this.addModal = true
        },
        created() {
            this.$swal({
                title: 'Vehicle Created',
                type: 'success',
            })

            this.addModal = false
            this.$refs.table.doSearch()
        },
    },
}
</script>
<style></style>
