import axios from 'axios'
import { refreshToken } from '@/refresh-token'
import { encodeData } from '@/utils'

export default {
    create(model) {
        return axios.post(`order`, model)
    },
    fetchById(id) {
        return axios.get(`order/${id}`)
    },
    fetch(query, filters, page) {
        return axios.get(`order?q=${query}&page=${page}&` + buildQuery(filters))
    },
    fetchDrivers() {
        return axios.get(`user/all`)
    },
    fetchWarehouses() {
        return axios.get(`warehouse/all`)
    },
    fetchCustomers() {
        return axios.get(`customer/all`)
    },
    update(id, model) {
        return axios.put(`order/${id}`, model)
    },
    delete(id) {
        return axios.delete(`order/${id}`)
    },
    markAsComplete(id) {
        return axios.post(`order/${id}/complete`)
    },
    markAsIncomplete(id) {
        return axios.post(`order/${id}/incomplete`)
    },

    /* Tasks */
    fetchTasks(orderId) {
        return axios.get(`order/${orderId}/checklist`)
    },

    updateTasks(orderId, tasks) {
        return axios.post(`order/${orderId}/checklist`, {
            data: tasks,
        })
    },

    /* Invoice */
    fetchInvoice(orderId) {
        return axios.get(`order/${orderId}/invoice`)
    },

    updateInvoice(orderId, tasks) {
        return axios.post(`order/${orderId}/invoice`, {
            data: tasks,
        })
    },
    // creates a whole order from an invoice definition
    // this is used by the
    uploadInvoice(invoice) {
        return axios.post(`order/invoice_upload`, invoice)
    },

    /* Notes */
    deleteNote(orderId, noteId) {
        return axios.delete(`order/${orderId}/note/${noteId}`)
    },

    /* Attachment */
    deleteAttachment(orderId, attachmentId) {
        return axios.delete(`order/${orderId}/attachment/${attachmentId}`)
    },

    /* Bulk Actions */
    bulkSetDriver(orders, driverId) {
        return axios.post(`order/bulk_set_driver`, {
            driverId: driverId,
            orders: orders.map(x => x.id),
        })
    },
    bulkSetWarehouse(orders, warehouseId) {
        return axios.post(`order/bulk_set_warehouse`, {
            warehouseId: warehouseId,
            orders: orders.map(x => x.id),
        })
    },
    bulkSetIncomplete(orders) {
        return axios.post(`order/bulk_set_incomplete`, {
            orders: orders.map(x => x.id),
        })
    },
    bulkDelete(orders) {
        return axios.post(`order/bulk_delete`, {
            orders: orders.map(x => x.id),
        })
    },

    /* Invoice Download */
    downloadInvoice(id) {
        refreshToken(axios).then(() => {
            let url =
                // 'https://oms.clientloop.io/api/v1/report?' +
                `http://34.220.123.185/api/v1/order/${id}/download?` +
                encodeData({
                    token: localStorage.getItem('accessToken'),
                })
            window.open(url, '_blank')
        })
    },

    /* Order Summary Download */
    downloadSummary(id) {
        refreshToken(axios).then(() => {
            let url =
                // 'https://oms.clientloop.io/api/v1/report?' +
                `http://34.220.123.185/api/v1/order/${id}/summary?` +
                encodeData({
                    token: localStorage.getItem('accessToken'),
                })
            window.open(url, '_blank')
        })
    },
}

var buildQuery = function(data) {
    // If the data is already a string, return it as-is
    if (typeof data === 'string') return data

    // Create a query array to hold the key/value pairs
    var query = []

    // Loop through the data object
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            // Encode each key and value, concatenate them into a string, and push them to the array
            query.push(
                encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
            )
        }
    }

    // Join each item in the array with a `&` and return the resulting string
    return query.join('&')
}
