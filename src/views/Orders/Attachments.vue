<template>
    <div>
        <h6 class="heading-small text-muted mb-4">Attachments</h6>
        <template v-if="order && order.attachments && order.attachments.length != 0">
            <LightBox :images="images" ref="lightbox" :show-caption="true" :show-light-box="false"></LightBox>
            <div class="row">
                <div
                    class="col-lg-4 text-right"
                    v-for="(item, index) in order.attachments"
                    :key="index"
                >
                    <img
                        :src="item.url"
                        @click="openGallery(index)"
                        style="width:100%; cursor:pointer;"
                    />
                    <base-button
                        style="margin-top:1em;"
                        size="sm"
                        type="primary"
                        @click="deleteAttachment(item.id)"
                        :disabled="submitting?true:false"
                    >{{ "Delete Attachment" }}</base-button>
                </div>
                <!-- <div class="col-md-12 text-right">
                
                </div>-->
            </div>
        </template>
        <div v-else style="padding:5em 0; text-align:center;">No Attachments Submitted</div>
    </div>
</template>

<script>
import api from '@/api/order'
import moment from 'moment'
import LightBox from 'vue-image-lightbox'

export default {
    name: 'attachments',
    components: {
        LightBox,
    },
    props: {
        order: {
            type: Object,
            default() {
                return {
                    attachments: [
                        {
                            url: '',
                        },
                    ],
                }
            },
        },
    },
    data() {
        return {
            images: [],
            submitting: false,
        }
    },
    methods: {
        deleteAttachment(id) {
            this.$swal
                .fire({
                    title: 'Delete Attachment?',
                    text: `Are you sure you want to delete this attachment?`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                })
                .then(result => {
                    if (!result.value) return

                    this.submitting = true
                    api.deleteAttachment(this.order.id, id)
                        .then(res => {
                            this.$swal({
                                title: 'Attachment Deleted!',
                                type: 'success',
                            })

                            let index = this.order.attachments.findIndex(
                                x => x.id == id
                            )
                            this.order.attachments.splice(index, 1)

                            this.recaclImages()
                        })
                        .catch(error => {
                            this.$swal({
                                title: 'Error Deleting Attachment!',
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

        openGallery(index) {
            this.$refs.lightbox.showImage(index)
        },
        recaclImages() {
            if (this.order) {
                this.images = []
                // console.log(this.order.attachments)
                for (let a of this.order.attachments) {
                    this.images.push({
                        thumb: a.url,
                        src: a.url,
                        caption: '',
                    })
                }
            }
        },
    },
    mounted() {
        // api.fetchNotes(this.$route.params.id).then(result => {
        //     this.notes = result.data.success.data
        // })
        // convert images to format lightbox uses
    },
    watch: {
        order() {
            // console.log(this.order)
            // console.log(this.order.attachments)
            this.recaclImages()
        },
    },
}
</script>

<style lang="scss" scoped>
</style>