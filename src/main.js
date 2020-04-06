import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'
import store from './store'
import VeeValidate from 'vee-validate'
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { addRefreshTokenFlow } from './refresh-token'

//dotenv.config()

//import 'vue-image-lightbox/dist/vue-image-lightbox.min.css'
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(VueLazyLoad)
Vue.use(ArgonDashboard)

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

// https://baianat.github.io/vee-validate/guide/custom-rules.html#creating-a-custom-rule
// VeeValidate.extend('confirmation', {
//     getMessage: field => field + ' does not match',
//     validate: function(value, args) {
//         const field = document.querySelector(`${args[0]}`)
//         return !!(field && String(value) === field.value)
//     },
// })
Vue.use(VeeValidate, {
    events: 'blur',
})
Vue.use(VueSweetalert2)
Vue.use(flatPicker)

const accessToken = localStorage.getItem('accessToken')
if (accessToken) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
    store.commit('authenticate', accessToken)
}
//axios.defaults.baseURL = 'http://localhost:8000/api/v1/'
//axios.defaults.baseURL = 'https://oms.clientloop.io/api/v1/'
axios.defaults.baseURL =
    process.env.VUE_APP_API_URL || 'http://localhost:8000/api/v1/'

addRefreshTokenFlow(axios)

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
