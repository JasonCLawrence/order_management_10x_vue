<template>
    <div class="main-content bg-default" style="height:100vh">
        <div class="container pb-5">
            <div class="row justify-content-center">
                <div class="col-lg-5 col-md-7">
                    <div class="card bg-secondary shadow border-0 mt-9">
                        <div class="card-body px-lg-5 py-lg-1">
                            <template v-if="submitted">
                                <div class="text-center text-muted mb-4 mt-4">
                                    <h5 class="display-4">Password Changed!</h5>
                                </div>
                                <div class="text-center text-muted mb-4 mt-4">
                                    We have sent a recovery email to you. Please continue the password recovery process there.
                                    <br />
                                    <br />
                                    <base-button type="primary" @click="backToLogin()">Back To Login</base-button>
                                </div>
                            </template>
                            <template v-else>
                                <div class="text-center text-muted mb-4 mt-4">
                                    <h5 class="display-4">Reset Your Password</h5>
                                </div>
                                <div class="text-center text-muted mb-4">
                                    <small>Reset your email address and password</small>
                                </div>
                                <base-alert
                                    type="danger"
                                    v-if="errors.has('token')"
                                >{{ errors.first('token') }}</base-alert>
                                <!-- <base-alert type="danger" v-if="signInError">Email Invalid</base-alert> -->

                                <form role="form" submit.prevent="login">
                                    <input type="hidden" name="token" />
                                    <base-input
                                        class="mb-3"
                                        label="Email"
                                        v-model="model.email"
                                        name="email"
                                        :error="errors.first('email')"
                                        v-validate="'required|email'"
                                    ></base-input>
                                    <base-input
                                        label="Password"
                                        type="password"
                                        v-model="model.password"
                                        name="password"
                                        :error="errors.first('password')"
                                        v-validate="'required|min:6'"
                                        ref="password"
                                    ></base-input>
                                    <base-input
                                        label="Retype Password"
                                        type="password"
                                        v-model="model.password_confirmation"
                                        name="confirmPassword"
                                        :error="errors.first('confirmPassword')"
                                        v-validate="'required|min:6|confirmed:password'"
                                    ></base-input>
                                    <div class="text-right">
                                        <base-button
                                            class="my-4"
                                            type="primary"
                                            :disabled="submitting?true:false"
                                            @click="submit()"
                                        >{{ submitting?"Submitting...":"Recover Your Password" }}</base-button>
                                    </div>
                                </form>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/auth'

export default {
    name: 'change-password',
    data() {
        return {
            submitting: false,
            signInError: false,
            // if successfully submitted
            submitted: false,
            model: {
                email: 'admin@oms.com',
                password: 'password',
                password_confirmation: 'password',
            },
        }
    },
    methods: {
        submit() {
            this.$validator.validate().then(valid => {
                this.submitting = true
                api.resetPassword({
                    ...this.model,
                    token: this.$route.query.token,
                })
                    .then(() => {
                        // route to dashboard
                        this.submitted = true
                    })
                    .catch(error => {
                        let messages = error.response.data.error.message
                        // show error
                        this.signInError = true
                        for (let field in messages) {
                            for (let e of messages[field]) {
                                this.$validator.errors.add({
                                    scope: null,
                                    field: field,
                                    msg: e,
                                })
                            }
                        }
                    })
                    .finally(() => {
                        this.submitting = false
                    })
            })
        },
        backToLogin() {
            this.$router.push('/login')
        },
    },
}
</script>
<style>
</style>
