import axios from 'axios'

export default {
    create(model) {
        return axios.post(`fleet`, model)
    },
    fetchById(id) {
        return axios.get(`fleet/${id}`)
    },
    fetch(query, page) {
        return axios.get(`fleet?q=${query}&page=${page}`)
    },
    fetchDrivers() {
        return axios.get(`user`)
    },
    fetchWarehouses() {
        return axios.get(`warehouse`)
    },
    update(id, model) {
        return axios.put(`fleet/${id}`, model)
    },
    delete(id) {
        return axios.delete(`fleet/${id}`)
    },
}
