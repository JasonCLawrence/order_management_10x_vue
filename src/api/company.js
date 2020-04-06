import axios from 'axios'

export default {
    fetch() {
        return axios.get(`company`)
    },
    update(model) {
        return axios.put(`company`, model)
    },
}
