import store from './store'
import router from './router'

// https://blog.liplex.de/axios-interceptor-to-refresh-jwt-token-after-expiration/
export function addRefreshTokenFlow(axios) {
    axios.interceptors.response.use(
        res => {
            return res
        },
        error => {
            if (error.response.status !== 401) {
                return new Promise((resolve, reject) => {
                    reject(error)
                })
            }

            // if this is a failed attempt to refresh token
            // logout
            if (error.config.url == '/auth/refresh-token') {
                // clear refresh token and return to home page
                store.commit('unauthenticate')
                router.push('/login')

                return new Promise((resolve, reject) => {
                    reject(error)
                })
            }

            // actually refresh token
            return refreshToken(axios)
                .then(token => {
                    // New request with new token
                    // console.log(token)
                    // console.log(error.config)
                    const config = error.config
                    config.headers['Authorization'] = `Bearer ${token}`

                    return new Promise((resolve, reject) => {
                        axios
                            .request(config)
                            .then(response => {
                                resolve(response)
                            })
                            .catch(error => {
                                reject(error)
                            })
                    })
                })
                .catch(error => {
                    return new Promise((resolve, reject) => {
                        reject(error)
                    })
                })
        }
    )
}

// actually fetch the auth token
export function refreshToken(axios) {
    return new Promise((resolve, reject) => {
        axios
            .get('/auth/refresh-token')
            .then(res => {
                let token = res.data.success.data.token
                //console.log(token)
                axios.defaults.headers.common['Authorization'] =
                    'Bearer ' + token

                store.commit('authenticate', token)
                localStorage.setItem('accessToken', token)
                // console.log(token)
                resolve(token)
            })
            .catch(error => {
                // if error is 500 then logout
                if (error.response && error.response.status == 500) {
                    store.commit('unauthenticate')
                    localStorage.removeItem('accessToken')
                }

                reject(error)
            })
    })
}
