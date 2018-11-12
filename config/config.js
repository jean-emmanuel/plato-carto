var html = require('nanohtml'),
    compagnies = require('../data/compagnies').map(x => {x._type = 'compagnie'; return x}),
    structures = require('../data/structures').map(x => {x._type = 'structure'; return x}),
    dataset = compagnies.concat(structures).sort((a, b) => a.nom[0].toLowerCase() > b.nom[0].toLowerCase()),
    templates = require('./templates.js'),
    reseaux = require('../data/reseaux'),
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
    return m
})

function getClusterMarkers(cluster) {
    var markers = cluster._markers
    for (var i = 0; i < cluster._childClusters.length; i++) {
        markers = markers.concat(getClusterMarkers(cluster._childClusters[i]))
    }
    return markers
}

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

        },
        {
            label: 'Départements',
            show: false,
            layer: ['geoJSON', {
                type: 'FeatureCollection',
                features: [
                    require('../data/departements/72.json'),
                    require('../data/departements/49.json'),
                    require('../data/departements/85.json'),
                    require('../data/departements/53.json'),
                    require('../data/departements/44.json')
                ]
            }, {weight: 1.5, fillOpacity: 0.05}],

        }
    ]
    .concat(
        Object.keys(reseaux).map(r=>{
            var lines = polygon(dataset.filter(m => m.reseaux.includes(r)))
            return {
                label: r,
                htmlLabel: `<a href="${reseaux[r]}" target="_blank">${r}</a>`,
                control: false,
                tooltip: lines.features[0].geometry.coordinates[0][0],
                layer: ['geoJSON', lines, {weight: 1.5, fillOpacity: 0.1}],
            }
        })
    ),
    markers: dataset,
    iconClass: (item) => 'icon-' + item._type,
    tooltip: (item) => item.nom,
    clusterIcon: (cluster)=>{
        var structs = getClusterMarkers(cluster).filter(m => m.options._data._type === 'structure').length,
            comps = cluster.getChildCount() - structs

        return `
            <div class="${structs ? 'structures' : ''} ${comps ? 'compagnies' : ''}">
                ${structs ? `<span>${structs}</span>` : ''}
                ${comps ? `<span>${comps}</span>` : ''}
            </div>
        `
    }

}
