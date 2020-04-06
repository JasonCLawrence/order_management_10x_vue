import api from '@/api/fleet'

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
            api.create(payload)
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
                        return x
                    })
                    context.commit('set', users)
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
            api.update(payload.id, payload)
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
                    context.commit('delete', id)
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
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
