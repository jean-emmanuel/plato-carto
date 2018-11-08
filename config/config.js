var html = require('nanohtml'),
    compagnies = require('../data/compagnies').map(x => {x._type = 'compagnie'; return x}),
    structures = require('../data/structures').map(x => {x._type = 'structure'; return x}),
    dataset = compagnies.concat(structures).sort((a, b) => a.nom[0].toLowerCase() > b.nom[0].toLowerCase()),
    templates = require('./templates.js')


dataset = dataset.map((m)=>{
    m._searchfield = [
        m.nom,
        m.nom.replace(/'/g, '  '),
        m.adresse,
        m.codepostal,
        m.ville,
        m.diffusion_festival_nom || ''
    ].join(' ')
    m._score = 0
    return m
})


var convex = require('turf-convex')
var geoJSONSet = dataset.map(m => ({
      ...m,
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [m.coords[1], m.coords[0]]
    }
}))
var c =convex({
    type: "FeatureCollection",
    features: geoJSONSet.filter(m => m.reseaux.includes('JP'))
})

module.exports = {

    tiles: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    view: [47.4, -1.6],
    zoom: 8,
    minZoom: 6,
    maxZoom: 18,
    controlsPosition: 'topright',
    layers: [
        {
            label: 'Région',
            layer: ['geoJSON', require('../data/region-pays-de-la-loire.json'), {weight: 1.5, fillOpacity: 0.1}],

        }
        // ['geoJSON', c, {weight: 1.5, fillOpacity: 0.1, fillColor: 'red'}]
    ],
    markers: dataset,
    iconClass: (item) => 'icon-' + item._type,
    tooltip: (item) => item.nom

}
