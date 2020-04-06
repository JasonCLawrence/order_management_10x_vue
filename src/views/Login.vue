<template>
    <div class="main-content bg-default" style="height:100vh">
        <div class="container pb-5">
            <div class="row justify-content-center">
                <div class="col-lg-5 col-md-7">
                    <div class="card bg-secondary shadow border-0 mt-9">
                        <div class="card-body px-lg-5 py-lg-1">
                            <div class="text-center text-muted mb-4">
                                <h1 class="display-1">OMS</h1>
                            </div>
                            <div class="text-center text-muted mb-4">
                                <small>Sign in with credentials</small>
                            </div>
                            <base-alert type="danger" v-if="signInError">Email or Password invalid</base-alert>

                            <form role="form" v-on:submit.prevent="login" v-on:keyup.enter="login">
                                <base-input
                                    class="mb-3"
                                    placeholder="Email"
                                    addon-left-icon="ni ni-email-83"
                                    v-model="model.email"
                                ></base-input>

                                <base-input
                                    placeholder="Password"
                                    type="password"
                                    addon-left-icon="ni ni-lock-circle-open"
                                    v-model="model.password"
                                ></base-input>
                                <div>
                                    <router-link to="/forgot_password">
                                        <small>forgot your password?</small>
                                    </router-link>
                                </div>
                                <div class="text-right">
                                    <base-button
                                        class="my-4"
                                        type="primary"
                                        :disabled="signingIn?true:false"
                                        @click="login()"
                                    >{{ signingIn?"Signing In":"Sign In" }}</base-button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    data() {
        return {
            signingIn: false,
            signInError: false,
            model: {
                email: '',
                password: '',
            },
        }
    },
    methods: {
        login() {
            this.signingIn = true
            this.$store
                .dispatch('login', {
                    email: this.model.email,
                    password: this.model.password,
                })
                .then(() => {
                    // route to dashboard
                    this.$router.push('dashboard')
                })
                .catch(error => {
                    // show error
                    console.log(error)
                    this.signInError = true
                })
                .finally(() => {
                    this.signingIn = false
                })
        },
    },
}
</script>
<style>
</style>
