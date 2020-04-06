import axios from 'axios'

export default {
    // optionally filter by uer
    fetch(user, page) {
        return axios.get(`auditlogs?user=${user}&page=${page}`)
    },

    delete(id) {
        return axios.delete(`auditlogs/${id}`)
    },
}
