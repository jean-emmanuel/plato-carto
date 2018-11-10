var html = require('nanohtml'),
    compagnies = require('../data/compagnies').map(x => {x._type = 'compagnie'; return x}),
    structures = require('../data/structures').map(x => {x._type = 'structure'; return x}),
    dataset = compagnies.concat(structures).sort((a, b) => a.nom[0].toLowerCase() > b.nom[0].toLowerCase()),
    templates = require('./templates.js'),
    polygon = require('./polygon')


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

var reseaux = (()=>{
    var c = [],
        r = []
    dataset.forEach(x => r = r.concat(x.reseaux.split('\n')))
    for (var i in r) {
        if (!c.includes(r[i]) && r[i]) c.push(r[i])
    }
    return c
})()

module.exports = {

    tiles: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    view: [47.4, -1.6],
    zoom: 8,
    minZoom: 6,
    maxZoom: 18,
    controlsPosition: 'topright',
    layers: [
        {
            label: 'Pays de la Loire',
            show: true,
            layer: ['geoJSON', require('../data/region-pays-de-la-loire.json'), {weight: 1.5, fillOpacity: 0.1}],

        }
    ]
    .concat(
        reseaux.map(r=>{
            var lines = polygon(dataset.filter(m => m.reseaux.includes(r)))
            return {
                label: r,
                tooltip: lines.geometry.coordinates[0][0],
                layer: ['geoJSON', lines]
            }
        })
    ),
    markers: dataset,
    iconClass: (item) => 'icon-' + item._type,
    tooltip: (item) => item.nom

}
