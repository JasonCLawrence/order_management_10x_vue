<template>
    <form role="form" submit.prevent="login">
        <h2 class="text-center">Add Vehicle</h2>

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
            label="Registration"
            placeholder
            name="registration"
            v-model="model.registration"
            :error="errors.first('registration')"
            v-validate="'required'"
            type="text"
        ></base-input>

        <!-- <div class="form-group">
            <label class="form-control-label">Make</label>
            <div class="has-label">
                <select id="make" name="make" class="form-control">
                    <option>Audi</option>
                    <option>Honda</option>
                    <option>Mitsubishi</option>
                    <option>Ford</option>
                </select>
            </div>
        </div>-->

        <base-input
            label="Model"
            placeholder
            name="model"
            v-model="model.model"
            :error="errors.first('model')"
            v-validate="'required'"
            type="text"
        ></base-input>

        <!-- <div class="form-group">
            <label class="form-control-label">Driver</label>
            <div class="has-label">
                <select id="driver" name="driver" class="form-control">
                    <option>None</option>
                    <option>Harry</option>
                    <option>Nicolas</option>
                </select>
            </div>
        </div>-->

        <div class="form-group">
            <label class="form-control-label">Description</label>
            <div class="has-label">
                <textarea
                    class="form-control"
                    v-model="model.description"
                    rows="3"
                    placeholder="Small description of vehicle..."
                ></textarea>
            </div>
        </div>

        <div class="form-group">
            <label class="form-control-label">Color</label>
            <div class="has-label">
                <input type="color" v-model="model.color" valid="true" class="form-control" />
            </div>
        </div>

        <!-- <div class="text-right">
      <base-button
        class="my-4"
        type="primary"
        :disabled="signingIn?true:false"
        @click="login()"
      >{{ signingIn?"Signing In":"Sign In" }}</base-button>
        </div>-->
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
            >{{ submitting?"Creating...":"Create" }}</base-button>
        </div>
    </form>
</template>

<script>
export default {
    name: 'create-vehicle-form',
    props: [],
    data: () => {
        return {
            model: {
                name: '',
                registration: '',
                make: '',
                model: '',
                description: '',
                color: '#efefef',
                active: '',
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
                        .dispatch('fleet/create', this.model)
                        .then(() => {
                            this.model = {
                                name: '',
                                registration: '',
                                make: '',
                                model: '',
                                description: '',
                                color: '#efefef',
                                active: '',
                            }
                            this.submitting = false
                            this.$emit('success')
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.submitting = false
                        })
                } else {
                    this.submitting = false
                }
            })
        },
    },
}
</script>
