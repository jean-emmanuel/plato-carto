var leaflet = require('leaflet'),
    config = require('../../data/config'),
    materialize = require('materialize-css'),
    modal = require('./modal')

Object.assign(leaflet, require('leaflet.markercluster'))


class Map {

    constructor(o) {

        var options = Object.assign({
            tiles: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
            view: [],
            maxZoom: 18,
            minZoom: 6,
            controlsPosition: 'topright',
            layers: [],
            markers: [],
            iconClass: marker => '',
            tooltip: marker => 'Title',
            listView: marker => 'Short description (html)',
            modalView: marker => 'Long description (html)'

        }, o)

        this.markers = options.markers
        this.listView = options.listView
        this.modalView = options.modalView

        this.map = leaflet.map('map', {
            zoomControl: false,
            center: options.view,
            zoom: options.zoom,
            minZoom: options.minZoom,
            maxZoom: options.maxZoom,
        })


        document.getElementById('zoom-in').addEventListener('click', e => this.map.zoomIn())
        document.getElementById('zoom-out').addEventListener('click', e => this.map.zoomOut())

        this.addLayer('tileLayer', options.tiles)
        for (var l of options.layers) {
            this.addLayer(...l)
        }

        this.cache = this.markers.map((m)=>{
            let icon = leaflet.divIcon({html: '<i class="fas fa-fw fa-map-marker-alt"></i><i class="fas fa-fw fa-map-marker-alt icon-shadow"></i>', className: options.iconClass(m)})
            return leaflet.marker(m.coords, {icon: icon, _data: m, bubblingMouseEvents: true})
        })

        this.markerLayer = this.addLayer('markerClusterGroup', {
            showCoverageOnHover: false,
            // maxClusterRadius: 60,
            iconCreateFunction: function(cluster) {
                return leaflet.divIcon({
                    html: `
                        <i class="fas fa-fw fa-circle"></i><i class="fas fa-fw fa-circle icon-shadow"></i>
                        <div class="count">${cluster.getChildCount()}</div>
                    `,
                    className: 'cluster'
                })
            }
        })


        // Tooltips & Modals

        var popup

        this.markerLayer.on('click', (e)=>{
            if (popup) popup.destroy()
            modal(this.modalView(e.layer.options._data))
        })

        this.markerLayer.on('mouseover', (e)=>{

            var el = e.layer._icon

            popup = materialize.Tooltip.getInstance(el)

            if (popup) return

            el.setAttribute('data-Tooltip', options.tooltip(e.layer.options._data))
            popup = materialize.Tooltip.init(el, {
                position: 'top',
                margin: 30
            })

        })

        this.map.on('zoomend', (e)=>{
            if (popup) popup.destroy()
        })



    }

    setView(view) {

        this.map.setView(...view)

    }

    addLayer(type, ...args) {

        return leaflet[type](...args).addTo(this.map)

    }

    addControl(type, ...args) {

        return leaflet.control[type](...args).addTo(this.map)

    }

    getVisibleMarkers() {

        return this.markers.filter(m => m._visible)

    }

    drawMarkers(filter) {


        for (var i = 0; i < this.markers.length; i++) {

            var m = this.markers[i]

            if (filter && !filter(m)) {
                this.markers[i]._visible = false
                this.markerLayer.removeLayer(this.cache[i])
            } else {
                this.markers[i]._visible = true
                this.cache[i].addTo(this.markerLayer)
            }


        }

    }

}



module.exports = new Map(config.map)
