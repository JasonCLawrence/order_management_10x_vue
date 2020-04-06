import api from '@/api/order'

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
                    resolve(res.data.success.data)
                })
                .catch(res => {
                    reject(res)
                })
        })
    },
    fetch(context, payload) {
        return new Promise((resolve, reject) => {
            api.fetch(payload.query, payload.filters, payload.page)
                .then(result => {
                    let orders = result.data.success.data.data.map(o => {
                        o.totalTasks = o.checklist.length
                        o.completedTasks = o.checklist.filter(x => {
                            return x.checked == 1
                        }).length

                        if (o.totalTasks != 0)
                            o.taskCompletion =
                                (o.completedTasks / o.totalTasks) * 100
                        else o.taskCompletion = 0

                        o.checked = false

                        return o
                    })

                    context.commit('set', orders)
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
    bulkSetDriver(context, payload) {
        return new Promise((resolve, reject) => {
            api.bulkSetDriver(payload.orders, payload.driverId)
                .then(result => {
                    resolve()
                })
                .catch(result => {
                    reject()
                })
        })
    },
    bulkSetWarehouse(context, payload) {
        return new Promise((resolve, reject) => {
            api.bulkSetWarehouse(payload.orders, payload.warehouseId)
                .then(result => {
                    resolve()
                })
                .catch(result => {
                    reject()
                })
        })
    },
    bulkSetIncomplete(context, payload) {
        return new Promise((resolve, reject) => {
            api.bulkSetIncomplete(payload.orders)
                .then(result => {
                    resolve()
                })
                .catch(result => {
                    reject()
                })
        })
    },
    bulkDelete(context, payload) {
        return new Promise((resolve, reject) => {
            api.bulkDelete(payload.orders)
                .then(result => {
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
