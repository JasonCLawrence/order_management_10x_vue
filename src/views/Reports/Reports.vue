<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-5 d-flex" />

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <reports-table title="Reports" ref="table"></reports-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ReportsTable from './ReportsTable'

export default {
    name: 'tables',
    components: {
        ReportsTable,
    },

    methods: {},
}
</script>
<style></style>
