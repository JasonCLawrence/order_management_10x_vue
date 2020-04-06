<template>
    <form role="form" submit.prevent="create">
        <h2 class="text-center">Add Customer</h2>

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
            label="Email"
            placeholder
            name="email"
            v-model="model.email"
            :error="errors.first('email')"
            v-validate="'required|email'"
            type="email"
        ></base-input>

        <base-input
            label="Address"
            placeholder
            name="address"
            v-model="model.address"
            :error="errors.first('address')"
            v-validate="'required'"
            type="address"
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
    name: 'create-customer-form',
    components: { LMap, LTileLayer, LMarker },
    props: [],
    data: () => {
        return {
            model: {
                name: '',
                email: '',
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
                        .dispatch('customers/create', this.model)
                        .then(() => {
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
        invalidateMap() {
            setTimeout(() => {
                this.$refs.map.mapObject.invalidateSize()
            }, 1000)
        },
    },
    mounted: function() {
        // setTimeout(() => {
        //     this.$refs.map.mapObject.invalidateSize()
        //     console.log('update')
        // }, 1000)
    },
}
</script>
