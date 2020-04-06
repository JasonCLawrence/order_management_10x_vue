import userApi from '@/api/user'

export const state = {
    users: [],
    pagination: null,
}

export const mutations = {
    set_users(state, payload) {
        state.users = payload
    },
    delete_user(state, id) {
        let index = state.users.findIndex(x => x.id == id)
        state.users.splice(index, 1)
    },
    set_pagination(state, pag) {
        state.pagination = pag
    },
}

export const actions = {
    createUser(context, payload) {
        return new Promise((resolve, reject) => {
            userApi
                .create(
                    payload.firstName,
                    payload.lastName,
                    payload.email,
                    payload.roles,
                    payload.password
                )
                .then(res => {
                    resolve(res)
                })
                .catch(res => {
                    reject(res)
                })
        })
    },
    async fetchUsers(context, payload) {
        return new Promise((resolve, reject) => {
            userApi
                .fetchUsers(payload.query, payload.page)
                .then(result => {
                    //context.commit('user_update_info', payload)
                    // console.log(result)
                    //console.log(context)
                    let users = result.data.success.data.data.map(x => {
                        x.firstName = x.first_name
                        x.lastName = x.last_name
                        delete x.first_name
                        delete x.last_name

                        return x
                    })
                    // console.log(users)
                    context.commit('set_users', users)
                    let pag = result.data.success.data
                    context.commit('set_pagination', {
                        page: pag.current_page,
                        pageSize: pag.per_page,
                        total: pag.total,
                    })
                    resolve()
                })
                .catch(() => {
                    reject()
                })
        })
    },
    deleteUser(context, id) {
        return new Promise((resolve, reject) => {
            userApi
                .deleteUser(id)
                .then(result => {
                    context.commit('delete_user', id)
                    resolve()
                })
                .catch(result => {
                    reject()
                })
        })
    },
    updateBasicInfo(context, payload) {
        return new Promise((resolve, reject) => {
            userApi
                .updateInfo(
                    payload.userId,
                    payload.firstName,
                    payload.lastName,
                    payload.roles
                )
                .then(() => {
                    //context.commit('user_update_info', payload)
                    resolve()
                })
                .catch(() => {
                    reject()
                })
        })
    },
    updateEmail(context, payload) {
        return new Promise((resolve, reject) => {
            userApi
                .updateEmail(payload.userId, payload.email)
                .then(() => {
                    //context.commit('user_update_email', payload)
                    resolve()
                })
                .catch(() => {
                    reject()
                })
        })
    },
    updatePassword(context, payload) {
        return new Promise((resolve, reject) => {
            userApi
                .updatePassword(payload.userId, payload.password)
                .then(() => {
                    //context.commit('user_update_password', payload)
                    resolve()
                })
                .catch(() => {
                    reject()
                })
        })
    },
}

export const getters = {}

export default {
    state,
    mutations,
    actions,
    getters,
}
