<template>
    <div>
        <h6 class="heading-small text-muted mb-4">Notes</h6>
        <template v-if="order && order.notes && order.notes.length != 0">
            <div class="row" v-for="(item, index) in order.notes" :key="index">
                <div class="col-lg-12">
                    <div class="form-group">
                        <i class="text-sm">{{ displayTime(item.created_at) }}</i>
                        <div class="has-label">
                            <textarea class="form-control" disabled v-model="item.content"></textarea>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 text-right">
                    <base-button
                        size="sm"
                        type="primary"
                        @click="deleteNote(item.id)"
                        :disabled="submitting?true:false"
                    >{{ "Delete Note" }}</base-button>
                </div>
            </div>
        </template>
        <div v-else style="padding:5em 0; text-align:center;">No Notes Submitted</div>
    </div>
</template>

<script>
import api from '@/api/order'
import moment from 'moment'

export default {
    name: 'notes',
    props: {
        order: {
            type: Object,
            default() {
                return {
                    notes: [
                        {
                            id: 0,
                            content: '',
                        },
                    ],
                }
            },
        },
    },
    data() {
        return {
            submitting: false,
        }
    },
    methods: {
        deleteNote(id) {
            this.$swal
                .fire({
                    title: 'Delete Note?',
                    text: `Are you sure you want to delete this order?`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                })
                .then(result => {
                    if (!result.value) return

                    this.submitting = true
                    api.deleteNote(this.order.id, id)
                        .then(res => {
                            this.$swal({
                                title: 'Note Deleted!',
                                type: 'success',
                            })

                            let index = this.order.notes.findIndex(
                                x => x.id == id
                            )
                            this.order.notes.splice(index, 1)
                        })
                        .catch(error => {
                            this.$swal({
                                title: 'Error Deleting Note!',
                                type: 'error',
                            })
                        })
                        .finally(() => {
                            this.submitting = false
                        })
                })
        },
        displayTime(time) {
            return moment(time, 'YYYY-MM-DD HH:mm:ss').format(
                'dddd, MMMM Do YYYY, h:mm:ss a'
            )
        },
    },
    mounted() {
        // api.fetchNotes(this.$route.params.id).then(result => {
        //     this.notes = result.data.success.data
        // })
    },
}
</script>

<style lang="scss" scoped>
</style>