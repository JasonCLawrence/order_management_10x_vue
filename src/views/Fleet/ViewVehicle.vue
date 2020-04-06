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
                                    <h3 class="mb-0">Vehicle</h3>
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
                                                placeholder="Luxury Car"
                                                v-model="model.name"
                                                name="name"
                                                :error="errors.first('name')"
                                            />
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label class="form-control-label">Driver</label>
                                                <div class="has-label">
                                                    <select
                                                        id="driver"
                                                        name="driver"
                                                        class="form-control"
                                                        v-model="model.driver"
                                                    >
                                                        <option :value="0">None</option>
                                                        <option
                                                            v-for="(driver, key) in drivers"
                                                            :value="driver.id"
                                                            :key="key"
                                                        >{{driver.first_name}} {{driver.last_name}}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <base-input
                                                alternative
                                                label="Registration"
                                                placeholder="2312..."
                                                v-model="model.registration"
                                                name="registration"
                                                :error="errors.first('registration')"
                                            />
                                        </div>
                                        <div class="col-lg-12">
                                            <base-input
                                                alternative
                                                label="Model"
                                                placeholder="2312..."
                                                v-model="model.model"
                                                name="model"
                                                :error="errors.first('model')"
                                            />
                                        </div>

                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label class="form-control-label">Description</label>
                                                <div class="has-label">
                                                    <textarea
                                                        class="form-control"
                                                        v-model="model.description"
                                                        rows="3"
                                                        placeholder="Small description of vehicle..."
                                                        name="description"
                                                        :error="errors.first('description')"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label class="form-control-label">Color</label>
                                                <div class="has-label">
                                                    <input
                                                        type="color"
                                                        v-model="model.color"
                                                        valid="true"
                                                        class="form-control"
                                                        name="color"
                                                        :error="errors.first('color')"
                                                    />
                                                </div>
                                            </div>
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
import api from '@/api/fleet'

export default {
    name: 'view-vehicle',
    data() {
        return {
            model: {
                id: 0,
                name: '',
                location: '',
                lat: '',
                lon: '',
                driver: 0,
                warehouse: 0,
            },
            updating: false,
            drivers: [],
            warehouses: [],
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
                                title: 'Vehicle Updated',
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

        api.fetchDrivers().then(result => {
            let drivers = result.data.success.data.data

            drivers = drivers.filter(x => {
                let res =
                    x.roles.findIndex(r => {
                        return r.role.name == 'driver'
                    }) !== -1
                return res
            })
            console.log(drivers)
            this.drivers = drivers
        })

        api.fetchWarehouses().then(result => {
            let warehouses = result.data.success.data.data
            this.warehouses = warehouses
        })
    },
}
</script>
<style></style>
