var html = require('nanohtml'),
    compagnies = require('../data/compagnies').map(x => {x._type = 'compagnie'; return x}),
    structures = require('../data/structures').map(x => {x._type = 'structure'; return x}),
    dataset = compagnies.concat(structures).sort((a, b) => a.nom[0].toLowerCase() > b.nom[0].toLowerCase()),
    templates = require('./templates.js')

module.exports = {

    tiles: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    view: [47.4, -1.6],
    zoom: 8,
    minZoom: 6,
    maxZoom: 18,
    controlsPosition: 'topright',
    layers: [
        ['geoJSON', require('../data/region-pays-de-la-loire.json'), {weight: 1.5, fillOpacity: 0.1}]
    ],
    markers: dataset.map((m) => {m._string = [m.nom, m.adresse, m.codepostal, m.ville].join(' '); return m}),
    iconClass: (item) => 'icon-' + item._type,
    tooltip: (item) => item.nom

}
