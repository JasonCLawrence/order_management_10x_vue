import axios from 'axios'

export default {
    fetch(query, page) {
        return axios.get(`dashboard`)
    },
}
