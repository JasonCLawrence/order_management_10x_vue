import api from '@/api/user'

export const state = {
    items: [],
    pagination: null,
}

export const mutations = {
    set(state, payload) {
        state.items = payload
    },
    delete(state, id) {
        let index = state.items.findIndex(x => x.id == id)
        state.items.splice(index, 1)
    },
    set_pagination(state, pag) {
        state.pagination = pag
    },
}

export const actions = {
    create(context, payload) {
        return new Promise((resolve, reject) => {
            api.create(
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
    fetch(context, payload) {
        return new Promise((resolve, reject) => {
            api.fetch(payload.query, payload.page)
                .then(result => {
                    let users = result.data.success.data.data.map(x => {
                        x.firstName = x.first_name
                        x.lastName = x.last_name
                        delete x.first_name
                        delete x.last_name

                        return x
                    })
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
    update(context, payload) {
        return new Promise((resolve, reject) => {
            api.update(
                payload.userId,
                payload.firstName,
                payload.lastName,
                payload.roles
            )
                .then(() => {
                    resolve()
                })
                .catch(() => {
                    reject()
                })
        })
    },
    delete(context, id) {
        return new Promise((resolve, reject) => {
            api.delete(id)
                .then(result => {
                    context.commit('fleet/delete', id)
                    resolve()
                })
                .catch(result => {
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
