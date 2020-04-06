<template>
    <modal class="pt-8" :show.sync="showModal">
        <form class="mt-3" role="form" submit.prevent="doNothing()">
            <h2 class="text-center">Export Details</h2>

            <base-checkbox v-model="model.includeInvoice">Include Invoice Items</base-checkbox>
            <base-checkbox v-model="model.includeTasks">Include Tasks</base-checkbox>
            <base-checkbox v-model="model.includeNotes">Include Notes</base-checkbox>
            <base-checkbox v-model="model.includeAuditLogs">Include Audit Logs</base-checkbox>

            <div class="text-right">
                <base-button
                    class="my-4"
                    type="warning"
                    :disabled="submitting?true:false"
                    @click="close()"
                >Close</base-button>
                <base-button
                    class="my-4"
                    type="primary"
                    :disabled="submitting?true:false"
                    @click="download()"
                >{{submitting?"Exporting..":"Export"}}</base-button>
            </div>
        </form>
    </modal>
</template>

<script>
import api from '@/api/report'

export default {
    data() {
        return {
            showModal: false,
            submitting: false,
            model: {
                includeInvoice: true,
                includeTasks: true,
                includeNotes: true,
                includeAuditLogs: false,
            },
            queryModel: {},
        }
    },
    methods: {
        show(queryModel) {
            this.showModal = true
        },
        close() {
            this.showModal = false
        },
        download() {
            this.submitting = true
            api.downloadReportDetails({
                ...this.queryModel,
                ...this.model,
            }).then(() => {
                this.submitting = false
            })
        },
        doNothing() {},
    },
}
</script>

<style scoped>
</style>