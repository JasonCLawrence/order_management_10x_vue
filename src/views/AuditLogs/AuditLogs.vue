<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-5 d-flex" />

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <audit-log-table title="Logs" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AuditLogTable from './AuditLogTable'

export default {
    name: 'tables',
    components: {
        AuditLogTable,
    },
    data: () => {
        return {}
    },

    methods: {},
}
</script>
<style></style>
