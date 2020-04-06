import axios from 'axios'
import { refreshToken } from '@/refresh-token'
import { encodeData } from '@/utils'

export default {
    fetch(params) {
        return axios.get(`report/headers`, { params: params })
    },
    downloadReport(params) {
        return refreshToken(axios).then(() => {
            let url =
                process.env.VUE_APP_API_URL +
                'report/headers?' +
                encodeData({
                    ...params,
                    xls: true,
                    token: localStorage.getItem('accessToken'),
                })
            window.open(url, '_blank')
        })
    },
    downloadReportDetails(params) {
        return refreshToken(axios).then(() => {
            let url =
                process.env.VUE_APP_API_URL +
                'report/details?' +
                encodeData({
                    ...params,
                    xls: true,
                    token: localStorage.getItem('accessToken'),
                })
            window.open(url, '_blank')
        })
    },
    fetchReportExcel(params) {
        return axios.get(`report`, {
            params: { ...params, xls: true },
            responseType: 'arraybuffer',
        })
    },
    fetchDrivers() {
        return axios.get(`user`)
    },
    fetchWarehouses() {
        return axios.get(`warehouse`)
    },
    fetchCustomers() {
        return axios.get(`customer`)
    },
}

// function refreshToken(axios) {
//     return new Promise((resolve, reject) => {
//         axios
//             .get('/auth/refresh-token')
//             .then(res => {
//                 let token = res.data.success.data.token
//                 resolve(token)
//             })
//             .catch(error => {
//                 reject(error)
//             })
//     })
// }
