var html =require('nanohtml'),
    compagnies = require('./compagnies').map(x => {x._type = 'compagnie'; return x}),
    structures = require('./structures').map(x => {x._type = 'structure'; return x}),
    dataset = compagnies.concat(structures),
    templates = require('./templates.js')

module.exports = {

    locale: {

        title: 'PlatO / Cartographie du spectacle jeune public en Pays de la Loire',
        header: 'Cartographie du Jeune Public en Pays de la Loire',
        noResults: 'Aucun résultat ne correspond à votre recherche.',
        more: 'En savoir plus'

    },

    map: {
        tiles: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        view: [47.4, -1.6],
        zoom: 8,
        minZoom: 6,
        maxZoom: 18,
        controlsPosition: 'topright',
        layers: [
            ['geoJSON', require('./region-pays-de-la-loire.json'), {weight: 1.5, fillOpacity: 0.1}]
        ],
        markers: dataset.map((m) => {m._string = [m.nom, m.adresse, m.codepostal, m.ville].join(' '); return m}),
        iconClass: (item) => 'icon-' + item._type,
        tooltip: (item) => item.nom,
        listView: templates.listView,
        modalView: templates.modalView,
    }

}
