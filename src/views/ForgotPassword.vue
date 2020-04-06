<template>
    <div class="main-content bg-default" style="height:100vh">
        <div class="container pb-5">
            <div class="row justify-content-center">
                <div class="col-lg-5 col-md-7">
                    <div class="card bg-secondary shadow border-0 mt-9">
                        <div class="card-body px-lg-5 py-lg-1">
                            <template v-if="submitted">
                                <div class="text-center text-muted mb-4 mt-4">
                                    <h5 class="display-4">Password Recovery</h5>
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
                                    <h5 class="display-4">Forgot Your Password?</h5>
                                </div>
                                <div class="text-center text-muted mb-4">
                                    <small>Enter your email address and we'll email you instructions on how to reset your password</small>
                                </div>
                                <base-alert type="danger" v-if="signInError">Email Invalid</base-alert>

                                <form role="form" submit.prevent="submit">
                                    <base-input
                                        class="mb-3"
                                        placeholder="Email"
                                        addon-left-icon="ni ni-email-83"
                                        v-model="model.email"
                                        name="email"
                                        :error="errors.first('email')"
                                        v-validate="'required|email'"
                                    ></base-input>
                                    <div class="text-right mt-4 mb-4">
                                        <base-button type="warning" @click="backToLogin()">Go Back</base-button>
                                        <base-button
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
    name: 'login',
    data() {
        return {
            submitting: false,
            signInError: false,
            submitted: true,
            model: {
                email: '',
            },
        }
    },
    mounted() {
        this.submitted = false
        this.signInError = false
        this.submitting = false
    },
    methods: {
        submit() {
            this.$validator.validate().then(valid => {
                if (valid) {
                    this.submitting = true
                    api.requestPasswordReset(this.model.email)
                        .then(() => {
                            this.submitted = true
                        })
                        .catch(error => {
                            // show error
                            this.signInError = true
                        })
                        .finally(() => {
                            this.signingIn = false
                            this.submitting = false
                        })
                }
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
