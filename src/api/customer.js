import axios from 'axios'

export default {
    create(model) {
        return axios.post(`customer`, model)
    },
    fetchById(id) {
        return axios.get(`customer/${id}`)
    },
    fetch(query, page) {
        return axios.get(`customer?q=${query}&page=${page}`)
    },
    update(id, model) {
        return axios.put(`customer/${id}`, model)
    },
    delete(id) {
        return axios.delete(`customer/${id}`)
    },
}
