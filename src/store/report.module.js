import api from '@/api/report'

export const state = {
    items: [],
}

export const mutations = {
    set(state, payload) {
        state.items = payload
    },
    delete(state, id) {
        let index = state.items.findIndex(x => x.id == id)
        state.items.splice(index, 1)
    },
}

export const actions = {
    fetch(context, payload) {
        return new Promise((resolve, reject) => {
            api.fetch(payload)
                .then(result => {
                    let items = result.data.success.data.map(x => {
                        return x
                    })
                    context.commit('set', items)
                    console.log(items)
                    resolve(items)
                })
                .catch(() => {
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
