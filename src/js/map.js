var leaflet = require('leaflet'),
    config = require('../../config/config'),
    templates = require('../../config/templates'),
    materialize = require('materialize-css'),
    modal = require('./modal'),
    html = require('nanohtml'),
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
            zoom: options.zoom,
            center: options.view,
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


        var layers = document.getElementById('layers')
        this.layers = {}

        for (let l of options.layers) {
            this.layers[l.label] = leaflet[l.layer[0]](l.layer[1], l.layer[2])
            if (l.tooltip) this.layers[l.label].addLayer(
                leaflet.marker(l.tooltip.reverse(), {opacity: 0.5}).bindTooltip(l.htmlLabel || l.label,
                    {permanent: true, direction:"center", offset: [0, -25], className: l.htmlLabel.indexOf('<a') > -1 ? 'clickable' : ''}
                )
            )
            if (l.control !== false) {
                let control = layers.appendChild(html`
                    <label>
                        <input type="checkbox" checked="${l.show}"/>
                        <span>${l.label}</span>
                    </label>
                `)
                control.addEventListener('change', (e)=>{
                    this.toggleLayer(l.label, e.target.checked)
                })
                this.layers[l.label]._control = control.getElementsByTagName('input')[0]
            }
            if (l.show) this.toggleLayer(l.label, true)
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
                    html: options.clusterIcon ? options.clusterIcon(cluster) : `
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

    init() {

        this.map.setView(this.initView, {
            paddingTopLeft: [sidepanel.opened() ? 350 : 0, 0]
        })

    }

    setView() {

        this.map.setView(...arguments)

    }

    addLayer(type, ...args) {

        return leaflet[type](...args).addTo(this.map)

    }

    toggleLayer(label, state) {

        var show = state === undefined ? !this.map.hasLayer(this.layers[label]) : state

        if (show) {
            this.map.addLayer(this.layers[label])
        } else {
            this.map.removeLayer(this.layers[label])
        }

        if (this.layers[label]._control) this.layers[label]._control.checked = show

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



module.exports = new Map(config)

list = require('./list')
setTimeout(()=>{
    sidepanel = require('./sidepanel')
    if (sidepanel.opened()) module.exports.map.panBy([-350 / 2, 0])
})
