import axios from 'axios'

const auth = {
    login(email, password) {
        return axios.post('auth/login', {
            email: email,
            password: password,
        })
    },
    requestPasswordReset(email) {
        return axios.post(`auth/pre_forgot`, {
            email: email,
        })
    },
    resetPassword(model) {
        return axios.put(`auth/post_forgot`, model)
    },
}

export default auth
