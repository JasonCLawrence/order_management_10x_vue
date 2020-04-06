<template>
    <div class>
        <l-map :zoom="zoom" :center="center" ref="map" style="height:418px">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker
                v-for="(driver, index) in drivers"
                :key="index"
                :lat-lng="drivers[index].latlon"
            >
                <l-popup :autoClose="false">{{driver.first_name}} {{driver.last_name}}</l-popup>
            </l-marker>
        </l-map>
    </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import _ from 'lodash'
const { NominatimJS } = require('@owsas/nominatim-js')
import api from '@/api/user'

export default {
    name: 'dashboard-map',
    components: { LMap, LTileLayer, LMarker, LPopup, VueBootstrapTypeahead },
    props: {
        value: {
            name: 'value',
            type: Object,
            default: () => L.latLng(18, -77.2),
        },
    },
    data() {
        return {
            model: {
                id: 0,
                name: '',
                location: '',
                lat: '',
                lon: '',
            },
            center: new L.latLng(18, -77.4),
            updating: false,
            zoom: 8,
            url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            popupData: "Hello I'm a Popup",
            query: '',
            addresses: [],
            drivers: [],
        }
    },
    mounted() {
        api.fetchDriverLocations().then(res => {
            let drivers = res.data.success.data

            // fetch locations of drivers
            let lat = 0
            let lon = 0
            let count = 0

            // average locations of workers and set center
            drivers = drivers.map(d => {
                if (d.lat == null || d.long == null) return null

                //console.log(d)
                lat += parseFloat(d.lat)
                lon += parseFloat(d.long)
                count++
                // console.log('center: ' + lat + ' ' + lon)
                // console.log('center: ' + d.lat + ' ' + d.long)

                d.latlon = new L.latLng(parseFloat(d.lat), parseFloat(d.long))
                return d
            })

            drivers = drivers.filter(d => {
                return d != null
            })

            // console.log(drivers)

            if (count != 0) {
                lat = lat / count
                lon = lon / count
            }

            // console.log('center: ' + this.center)
            // console.log('center: ' + lat + ' ' + lon)
            // console.log('count: ' + count)
            //this.center = new L.latLng(lat, lon)
            this.drivers = drivers
        })
    },
    methods: {
        setMarkerPos(pos) {
            //console.log('new pos', this.$refs.marker.mapObject.getLatLng())
            this.$emit('input', this.$refs.marker.mapObject.getLatLng())
        },
        itemSelected(item) {
            this.$emit('input', L.latLng(item.lat, item.lon))
        },
    },
    watch: {},
}
</script>

<style>
.autocomplete input {
    border-radius: 0;
}
</style>