<template>
    <form role="form" submit.prevent="login">
        <h2 class="text-center">Create User</h2>

        <base-input
            label="First Name"
            placeholder="John"
            name="firstName"
            v-model="model.firstName"
            :error="errors.first('firstName')"
            v-validate="'required'"
            type="text"
        ></base-input>

        <base-input
            label="Last Name"
            placeholder="Doe"
            v-model="model.lastName"
            name="lastName"
            :error="errors.first('lastName')"
            v-validate="'required'"
            type="text"
        ></base-input>

        <base-input
            label="Email"
            placeholder="Email"
            v-model="model.email"
            name="email"
            :error="errors.first('email')"
            v-validate="'required|email'"
            type="text"
        ></base-input>

        <base-input
            label="Password"
            type="password"
            v-model="model.password"
            name="password"
            :error="errors.first('password')"
            v-validate="'required|min:6'"
        ></base-input>

        <base-input
            label="Confirm Password"
            type="password"
            v-model="model.confirmPassword"
            name="confirmPassword"
            :error="errors.first('confirmPassword')"
            v-validate="'required|min:6|confirmed:password'"
        ></base-input>

        <div class="form-group has-label">
            <label class="form-control-label">Roles</label>
            <base-checkbox
                :checked="model.roles.includes('administrator')"
                @input="toggleRole('administrator')"
            >Administrator</base-checkbox>
            <base-checkbox
                :checked="model.roles.includes('driver')"
                @input="toggleRole('driver')"
            >Driver</base-checkbox>
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
            >{{ submitting ? "Creating.." : "Create" }}</base-button>
        </div>
    </form>
</template>

<script>
export default {
    name: 'create-user-form',
    props: [],
    data: () => {
        return {
            model: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                roles: ['driver'],
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
                        .dispatch('createUser', this.model)
                        .then(() => {
                            this.model = {
                                firstName: '',
                                lastName: '',
                                email: '',
                                password: '',
                                confirmPassword: '',
                                roles: ['driver'],
                            }
                            this.submitting = false
                            this.$emit('success')
                        })
                        .catch(res => {
                            // show errors
                            console.log(res)
                        })
                        .finally(() => {
                            this.submitting = false
                        })
                } else {
                }
            })
        },
        toggleRole(role) {
            let roles = this.model.roles
            if (roles.includes(role)) {
                roles.splice(roles.indexOf(role), 1)
            } else {
                roles.push(role)
            }
            this.model.roles = roles
        },
    },
}
</script>
