<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-5 d-flex" />

        <div class="container-fluid mt--7 pb-4">
            <div class="row">
                <div class="col-xl-8 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Customer</h3>
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
                                                label="Email"
                                                placeholder="email"
                                                v-model="model.email"
                                                name="email"
                                                :error="errors.first('email')"
                                                v-validate="'required|email'"
                                            />
                                        </div>
                                        <div class="col-lg-12">
                                            <base-input
                                                alternative
                                                label="Address"
                                                placeholder
                                                v-model="model.address"
                                                name="address"
                                                :error="errors.first('address')"
                                            />
                                        </div>
                                        <div class="col-md-12">
                                            <location-picker v-model="model.center" />
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
import api from '@/api/customer'
import LocationPicker from '@/components/Map/LocationPicker'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

export default {
    name: 'view-customer',
    components: { LMap, LTileLayer, LMarker, LocationPicker },
    data() {
        return {
            model: {
                id: 0,
                name: '',
                address: '',
                lat: '',
                long: '',
                center: L.latLng(18.002804952844535, -76.78970255393327),
            },
            updating: false,
        }
    },
    methods: {
        update() {
            this.updating = true

            this.model.lat = this.model.center.lat
            this.model.long = this.model.center.lng
            this.$validator.validate().then(valid => {
                if (valid) {
                    api.update(this.model.id, this.model)
                        .then(() => {
                            this.$swal({
                                title: 'Customer Updated',
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

            model.center = new L.latLng(
                model.lat ? model.lat : 0,
                model.long ? model.long : 0
            )

            this.model = model
        })
    },
}
</script>
<style></style>
