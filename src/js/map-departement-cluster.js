var leaflet = require('leaflet'),
    config = require('../../config/config'),
    templates = require('../../config/templates'),
    materialize = require('materialize-css'),
    modal = require('./modal'),
    sidepanel, list

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
            tooltip: marker => 'Title'

        }, o)

        this.markers = options.markers

        this.map = leaflet.map('map', {
            zoomControl: false,
            center: options.view,
            zoom: options.zoom,
            minZoom: options.minZoom,
            maxZoom: options.maxZoom,
            attribution: '© <a href= "http://cartodb.com/attributions#basemaps">CartoDB</a>'
        })

        var fitBounds = this.map.fitBounds
        this.map.fitBounds = (bounds, opt) => {
            opt = opt || {}
            opt.paddingTopLeft = [sidepanel.opened() ? 350 : 0, 0]
            fitBounds.call(this.map, bounds, opt)
        }


        document.getElementById('zoom-in').addEventListener('click', e => this.map.zoomIn())
        document.getElementById('zoom-out').addEventListener('click', e => this.map.zoomOut())

        this.addLayer('tileLayer', options.tiles, {
            attribution: 'Carte © <a href= "http://cartodb.com/attributions#basemaps">CartoDB</a>'

        })
        for (var l of options.layers) {
            this.addLayer(...l)
        }

        this.cache = this.markers.map((m)=>{
            let icon = leaflet.divIcon({html: '<i class="fas fa-fw fa-map-marker-alt"></i><i class="fas fa-fw fa-map-marker-alt icon-shadow"></i>', className: options.iconClass(m)})
            return leaflet.marker(m.coords, {icon: icon, _data: m, bubblingMouseEvents: true})
        })

        this.markerLayer = this.addLayer('featureGroup', {})
        this.markerLayers = {}
        for (var cp of [72, 49, 44, 85, 53]) {
            this.markerLayers[cp] = leaflet.markerClusterGroup({
                showCoverageOnHover: false,
                maxClusterRadius: 300,
                iconCreateFunction: function(cluster) {
                    return leaflet.divIcon({
                        html: `
                            <i class="fas fa-fw fa-circle"></i><i class="fas fa-fw fa-circle icon-shadow"></i>
                            <div class="count">${cluster.getChildCount()}</div>
                        `,
                        className: 'cluster'
                    })
                }
            }).addTo(this.markerLayer)
        }


        // Tooltips & Modals

        var popup

        this.markerLayer.on('click', (e)=>{
            if (popup) popup.destroy()
            var data = e.layer.options._data
            modal(templates.modalTitle(data), templates.modalView(data))
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

        document.addEventListener('click', (e)=>{
            var coords = e.target.getAttribute('data-coords')
            if (!coords) return
            coords = coords.split(',')
            e.preventDefault()
            modal.close()
            list.toggle(false)
            this.map.fitBounds([coords])
            // setTimeout(()=>{
            //     this.map.zoomOut(2)
            // }, 500)

        })



    }

    setView() {

        this.map.setView(...arguments)

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

            var m = this.markers[i],
                cp = String(m.codepostal).slice(0,2)
            if (!this.markerLayers[cp]) continue
            if (filter && !filter(m)) {
                this.markers[i]._visible = false
                this.markerLayer[cp].removeLayer(this.cache[i])
            } else {
                this.markers[i]._visible = true
                this.cache[i].addTo(this.markerLayers[cp])
            }


        }

    }

}



module.exports = new Map(config)

list = require('./list')
setTimeout(()=>{
    sidepanel = require('./sidepanel')
})
