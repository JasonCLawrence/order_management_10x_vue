<template>
    <div class="form-group has-label">
        <label class="form-control-label">Location</label>
        <vue-bootstrap-typeahead
            class="autocomplete"
            style="z-index:10000; border-radius:0;"
            v-model="query"
            placeholder="Search for a location"
            :serializer="t => t.display_name"
            :data="addresses"
            @hit="itemSelected"
        />
        <l-map :zoom="zoom" :center="value" ref="map" style="height:400px">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="value" :draggable="true" @moveend="setMarkerPos" ref="marker">
                <l-popup :content="popupData" :autoClose="false" />
            </l-marker>
        </l-map>
    </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import _ from 'lodash'
const { NominatimJS } = require('@owsas/nominatim-js')

export default {
    name: 'location-picker',
    components: { LMap, LTileLayer, LMarker, LPopup, VueBootstrapTypeahead },
    props: {
        value: {
            name: 'value',
            type: Object,
            default: () => L.latLng(14, -78),
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
            updating: false,
            zoom: 13,
            url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            popupData: "Hello I'm a Popup",
            query: '',
            addresses: [],
        }
    },
    mounted() {
        // console.log(this.$refs)
        // console.log(this.$refs.point)
        //this.$refs.marker.on('dragend', this.setMarkerPos)
        // https://stackoverflow.com/questions/54355375/vue-js-refs-are-undefined-even-though-this-refs-shows-theyre-there
        // this.$nextTick(() => {
        //     let self = this
        //     console.log(self.$refs) // Shows the mapRef object reference
        //     console.log(self.$refs.marker) // returns undefined ???
        //     this.$refs.marker.on('dragend', this.setMarkerPos)
        //     // L.marker(this.center)
        //     //     .addTo(this.$refs.map)
        //     //     .on('dragend', this.setMarkerPos)
        // })
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
    watch: {
        query: _.debounce(function() {
            NominatimJS.search({
                q: this.query,
            })
                .then(results => {
                    // do something with results
                    this.addresses = results
                })
                .catch(error => {
                    // error ocurred
                })
        }, 500),
    },
}
</script>

<style>
.autocomplete input {
    border-radius: 0;
}
</style>