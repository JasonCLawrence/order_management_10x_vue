import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import auth from '@/api/auth'

import users from './users.module'
import fleet from './fleet.module'
import customers from './customers.module'
import warehouses from './warehouses.module'
import settings from './settings.module'
import orders from './orders.module'
import report from './report.module'
import auditlogs from './auditlogs.module'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        users,
        fleet,
        customers,
        warehouses,
        settings,
        orders,
        report,
        auditlogs,
    },
    state: {
        user: null,
        authenticated: false,
        token: null,
    },
    mutations: {
        authenticate(state, token) {
            state.authenticated = true
            state.token = token
        },
        unauthenticate(state) {
            state.authenticated = false
            state.token = null
        },
    },
    actions: {
        login({ commit }, { email, password }) {
            return new Promise((resolve, reject) => {
                auth.login(email, password)
                    .then(({ data }) => {
                        //console.log(data.success.data.token);
                        let token = data.success.data.token

                        commit('authenticate', token)
                        axios.defaults.headers.common['Authorization'] =
                            'Bearer ' + token

                        localStorage.setItem('accessToken', token)
                        resolve()
                    })
                    .catch(error => {
                        //throw new Error(error);
                        reject(error)
                    })
            })
        },
        logout({ commit }) {
            commit('unauthenticate')

            localStorage.removeItem('accessToken')
        },
    },
})
