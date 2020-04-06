import axios from 'axios'

export default {
    me() {
        return axios.get('user/me')
    },
    create(firstName, lastName, email, roles, password) {
        return axios.post(`user`, {
            first_name: firstName,
            last_name: lastName,
            email: email,
            roles: roles,
            password: password,
        })
    },
    fetchById(id) {
        return axios.get(`user/${id}`)
    },
    fetchUsers(query, page) {
        return axios.get(`user?q=${query}&page=${page}`)
    },
    updateEmail(userId, email) {
        return axios.put(`user/${userId}/email`, {
            email: email,
        })
    },
    updateBasicInfo(userId, firstName, lastName, roles) {
        return axios.put(`user/${userId}`, {
            first_name: firstName,
            last_name: lastName,
            roles: roles,
        })
    },
    updatePassword(userId, password) {
        return axios.put(`user/${userId}/password`, {
            password: password,
        })
    },
    fetchDriverLocations() {
        return axios.get(`user/drivers/location`)
    },
}
