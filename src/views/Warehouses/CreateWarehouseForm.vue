<template>
    <form role="form" submit.prevent="login">
        <h2 class="text-center">Add Warehouse</h2>

        <base-input
            label="Name"
            placeholder
            name="name"
            v-model="model.name"
            :error="errors.first('name')"
            v-validate="'required'"
            type="text"
        ></base-input>

        <base-input
            label="Address"
            placeholder
            name="address"
            v-model="model.address"
            :error="errors.first('address')"
            v-validate="'required'"
            type="text"
        ></base-input>
        <div class="text-right">
            <base-button
                class="my-4"
                type="warning"
                :disabled="submitting?true:false"
                @click="cancel()"
            >Cancel</base-button>
            <base-button
                class="my-4"
                type="primary"
                :disabled="submitting?true:false"
                @click="create()"
            >Create</base-button>
        </div>
    </form>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

export default {
    name: 'create-warehouse-form',
    components: { LMap, LTileLayer, LMarker },
    props: [],
    data: () => {
        return {
            model: {
                name: '',
                address: '',
            },
            submitting: false,
            hasErrors: false,
        }
    },
    methods: {
        cancel() {
            this.$emit('cancel')
        },
        create() {
            this.$validator.validate().then(valid => {
                if (valid) {
                    this.submitting = true
                    this.$store
                        .dispatch('warehouses/create', this.model)
                        .then(() => {
                            this.model = {
                                name: '',
                                address: '',
                            }
                            this.submitting = false
                            this.$emit('success')
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.submitting = false
                        })
                } else {
                }
            })
        },
    },
}
</script>
