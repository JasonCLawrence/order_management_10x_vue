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
                                    <h3 class="mb-0">User</h3>
                                </div>
                                <div class="col-4 text-right"></div>
                            </div>
                        </div>
                        <template>
                            <div class="pl-lg-4">
                                <form @submit.prevent="updateBasic()" data-vv-scope="password">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <base-input
                                                alternative
                                                label="First Name"
                                                placeholder="John"
                                                v-model="model.firstName"
                                            />
                                        </div>
                                        <div class="col-lg-12">
                                            <base-input
                                                alternative
                                                label="Last Name"
                                                placeholder="Doe"
                                                v-model="model.lastName"
                                            />
                                        </div>

                                        <div class="col-lg-12">
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
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-12">
                                            <base-button
                                                @click="updateBasic()"
                                                class="float-right"
                                                :disabled="updatingBasic?true:false"
                                            >{{ updatingBasic?"Saving Changes...":"Save Changes" }}</base-button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <hr class="my-4" />
                            <!-- Address -->
                            <div class="pl-lg-4">
                                <form @submit.prevent="updateEmail();" data-vv-scope="email">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <base-input
                                                alternative
                                                label="Email"
                                                placeholder="username@oms.com"
                                                v-model="model.email"
                                                name="email"
                                                :error="errors.first('email.email')"
                                                v-validate="'required|email'"
                                            />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <base-button
                                                @click="updateEmail()"
                                                class="float-right"
                                                :disabled="updatingEmail?true:false"
                                            >{{ updatingEmail?"Updating Email...":"Update Email" }}</base-button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <hr class="my-4" />
                            <div class="pl-lg-4">
                                <form @submit.prevent="updatePassword();" data-vv-scope="password">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <base-input
                                                alternative
                                                label="New Password"
                                                v-model="model.password"
                                                type="password"
                                                name="password"
                                                :error="errors.first('password.password')"
                                                v-validate="'required|min:6'"
                                                ref="password"
                                            />
                                            <base-input
                                                alternative
                                                label="Confirm New Password"
                                                v-model="model.confirmPassword"
                                                type="password"
                                                name="confirmPassword"
                                                :error="errors.first('password.confirmPassword')"
                                                v-validate="'required|min:6|confirmed:password'"
                                            />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <base-button
                                                @click="updatePassword()"
                                                class="float-right"
                                                :disabled="updatingPassword?true:false"
                                            >{{ updatingPassword?"Changing Password...":"Change Password" }}</base-button>
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
import userApi from '@/api/user'

export default {
    name: 'edit-user',
    data() {
        return {
            model: {
                id: 0,
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                roles: [],
            },
            updatingBasic: false,
            updatingEmail: false,
            updatingPassword: false,
        }
    },
    methods: {
        updateBasic() {
            this.updatingBasic = true
            this.rolesError = null
            this.$validator.validate('basic.*').then(valid => {
                //this.updatingBasic = true
                if (valid) {
                    userApi
                        .updateBasicInfo(
                            this.model.id,
                            this.model.firstName,
                            this.model.lastName,
                            this.model.roles
                        )
                        .then(() => {
                            this.$swal({
                                title: 'User Updated',
                                type: 'success',
                            })
                        })
                        .catch(error => {
                            this.$swal({
                                title: error.response.data.error.message,
                                type: 'error',
                            })
                            // this.errors.add({
                            //     field: 'roles',
                            //     msg: error.response.data.error.message,
                            //     scope: 'basic',
                            //     id: 'roles',
                            // })
                        })
                        .finally(() => {
                            this.updatingBasic = false
                        })
                } else {
                    this.updatingBasic = false
                }
                // this.$store
                //     .dispatch('user_update_basic', {
                //         firstName: this.model.firstName,
                //         lastName: this.model.lastName,
                //     })
                //     .then(() => {})
                //     .finally(() => {
                //         this.updatingBasic = false
                //     })
            })
        },
        updateEmail() {
            this.updatingEmail = true
            this.$validator.validate('email.*').then(valid => {
                if (valid) {
                    userApi
                        .updateEmail(this.model.id, this.model.email)
                        .then(res => {
                            console.log(res)
                            this.$swal({
                                title: 'Email Updated',
                                type: 'success',
                            })
                        })
                        .catch(error => {
                            this.errors.add({
                                field: 'email',
                                msg: error.response.data.error.message,
                                scope: 'email',
                            })
                        })
                        .finally(() => {
                            this.updatingEmail = false
                        })
                } else {
                    this.updatingEmail = false
                }
                // this.$store
                //     .dispatch('user_update_email', {
                //         firstName: this.model.firstName,
                //         lastName: this.model.lastName,
                //     })
                //     .then(() => {})
                //     .finally(() => {
                //         this.updatingEmail = true
                //     })
            })
        },
        updatePassword() {
            this.updatingPassword = true
            this.$validator.validateAll('password').then(valid => {
                if (valid) {
                    console.log(this.model)
                    userApi
                        .updatePassword(this.model.id, this.model.password)
                        .then(() => {
                            this.$swal({
                                title: 'Password Updated',
                                type: 'success',
                            })
                        })
                        .finally(() => {
                            this.updatingPassword = false
                        })
                } else {
                    this.updatingPassword = false
                }
                // this.$store
                //     .dispatch('user_update_password', {
                //         password: this.model.password,
                //     })
                //     .then(() => {})
                //     .finally(() => {
                //         this.updatingPassword = true
                //     })
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
            console.log(roles)
        },
    },
    mounted() {
        // this.$validator.extend('confirmation', {
        //     getMessage: field => field + ' does not match',
        //     validate: function(value, args) {
        //         const field = document.querySelector(`${args[0]}`)
        //         return !!(field && String(value) === field.value)
        //     },
        // })

        userApi.fetchById(this.$route.params.id).then(result => {
            let model = result.data.success.data
            model.firstName = model.first_name
            model.lastName = model.last_name
            // fix roles
            //console.log(model)
            let roles = model.roles.map(r => {
                return r.role.name
            })
            model.roles = roles

            this.model = model
            console.log(this.model)
            console.log(model.roles.includes('administrator'))
            console.log(model.roles.includes('driver'))
        })
    },
}
</script>
<style></style>
