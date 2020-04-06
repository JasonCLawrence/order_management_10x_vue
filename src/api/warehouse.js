import axios from 'axios'

export default {
    namespaced: true,
    create(model) {
        return axios.post(`warehouse`, model)
    },
    fetchById(id) {
        return axios.get(`warehouse/${id}`)
    },
    fetch(query, page) {
        return axios.get(`warehouse?q=${query}&page=${page}`)
    },
    update(id, model) {
        return axios.put(`warehouse/${id}`, model)
    },
    delete(id) {
        return axios.delete(`warehouse/${id}`)
    },
}
