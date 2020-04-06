<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-5 d-flex" />

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-xl-8 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Warehouse</h3>
                                </div>
                                <div class="col-4 text-right"></div>
                            </div>
                        </div>
                        <template>
                            <div class="pl-lg-4">
                                <form @submit.prevent="update()">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <base-input
                                                alternative
                                                label="Name"
                                                placeholder="John"
                                                v-model="model.name"
                                                name="name"
                                                :error="errors.first('name')"
                                            />
                                        </div>
                                        <div class="col-lg-12">
                                            <base-input
                                                alternative
                                                label="Address"
                                                placeholder="Doe"
                                                v-model="model.address"
                                                name="address"
                                                :error="errors.first('address')"
                                            />
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-12">
                                            <base-button
                                                @click="update()"
                                                class="float-right"
                                                :disabled="updating?true:false"
                                            >{{ updating?"Saving Changes...":"Save Changes" }}</base-button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </template>
                    </card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/warehouse'
import LocationPicker from '@/components/Map/LocationPicker'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

export default {
    name: 'view-warehouse',
    components: { LMap, LTileLayer, LMarker, LocationPicker },
    data() {
        return {
            model: {
                id: 0,
                name: '',
                location: '',
                lat: '',
                lon: '',
            },
            updating: false,
            center: L.latLng(47.41322, -1.219482),
        }
    },
    methods: {
        update() {
            this.updating = true
            this.$validator.validate().then(valid => {
                if (valid) {
                    api.update(this.model.id, this.model)
                        .then(() => {
                            this.$swal({
                                title: 'Warehouse Updated',
                                type: 'success',
                            })
                        })
                        .catch(error => {
                            this.$swal({
                                title: error.response.data.error.message,
                                type: 'error',
                            })
                        })
                        .finally(() => {
                            this.updating = false
                        })
                } else {
                    this.updating = false
                }
            })
        },
    },
    mounted() {
        api.fetchById(this.$route.params.id).then(result => {
            let model = result.data.success.data

            this.model = model
        })
    },
}
</script>
<style></style>
