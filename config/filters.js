var LazySearch = require('lazy-search'),
    lazySearch = new LazySearch(),
    {markers} = require('./config')

module.exports = [

    {
        label: 'Rechercher',
        help: 'Filtrer par nom, ville, code postal...',
        type: 'text',
        value: '',
        icon: 'search',
        reset: true,
        filter: (data, value) => {
            var match = lazySearch.find(data._searchfield, value)
            delete data._score
            if (match.length) {
                data._score = match.reduce((a, m) => a + (m.contents.length / m.distance), 0)
                return true
            } else {
                return false
            }
        }
    },
    {
        type: 'select',
        label: 'Départements',
        choices: {
            "44": 'Loire-Atlantique',
            "49": 'Maine-Et-Loire',
            "53": 'Mayenne',
            "72": 'Sarthe',
            "85": 'Vendée',
        },
        filter: (data, value) => value.some(x => String(data.codepostal).slice(0,2) === x),
        onChange: (value, filters, map)=>{
            map.toggleLayer('Départements', !!value.length)
        }
    },
    {
        type: 'separator',
        class: 'transparent'
    },
    {
        type: 'checkbox',
        label: 'Compagnies / Artistes',
        icon: 'map-marker',
        disabled: (data, value) => value,
        value: true,
        filter: (data, value) => data._type !== 'compagnie'
    },
    {
        type: 'group',
        label: 'Filtres...',
        collapse: true,
        reset: true,
        disabled: (data, value, filters) => data._type !== 'compagnie',
        filters: [
            {
                type: 'checklist',
                label: 'Disposant d\'un lieu de',
                choices: {
                    "lieu_creation": "Création",
                    "lieu_diffusion": 'Diffusion'
                },
                filter: (data, value) => value.every(x => data[x] === 'Oui')
            },
            {
                type: 'checkradio',
                label: 'Conventionnées',
                choices: {
                    "Oui": "Oui",
                    "Non": 'Non'
                },
                filter: (data, value) => data.convention === value
            },
            {
                type: 'checkradio',
                label: 'Associée à une structure',
                choices: {
                    "Oui": "Oui",
                    "Non": 'Non'
                },
                filter: (data, value) => value === 'Oui' ? data.structure_associee : !data.structure_associee
            },
            {
                type: 'checklist',
                label: 'Formes artistiques dominantes',
                choices: {
                    "formesartistiques_theatre": "Théâtre",
                    "formesartistiques_danse": "Danse",
                    "formesartistiques_cirque": "Cirque",
                    "formesartistiques_musique": "Musique",
                    "formesartistiques_marionette": "Marionnette",
                    "formesartistiques_cinema": "Cinéma",
                    "formesartistiques_theatreobjet": "Théâtre d'objet",
                    "formesartistiques_autre": "Autre",
                },
                filter: (data, value) => value.some(x => x === "formesartistiques_autre" ? data[x] : data[x] !== 'Non')
            },
            {
                type: 'checklist',
                label: 'Tranches d\'âge du public',
                choices: {
                    "agecible_0_3ans": '0 – 3 ans',
                    "agecible_3_6ans": '3 – 6 ans',
                    "agecible_6_12ans": '6 – 12 ans',
                    "agecible_12ans": 'À partir de 12 ans',
                },
                filter: (data, value) => value.some(x => data[x] === 'Oui')
            },
        ]
    },
    {
        type: 'separator'
    },
    {
        type: 'checkbox',
        label: 'Structures',
        icon: 'map-marker',
        class: 'structures',
        disabled: (data, value) => value,
        value: true,
        filter: (data, value) => data._type !== 'structure'
    },
    {
        type: 'group',
        label: 'Filtres...',
        collapse: true,
        reset: true,
        class: 'structures',
        disabled: (data, value, filters) => data._type !== 'structure',
        filters: [
            {
                type: 'checklist',
                label: 'Activité',
                choices: {
                    activite_aidecreation: 'Aide à la création',
                    activite_diffusion: 'Diffusion',
                    activite_actionculturelle : 'Action Culturelle'
                },
                filter: (data, value) => value.some(x => data[x] === 'Oui')
            },
            {
                type: 'group',
                label: 'Diffusion',
                filters: [
                    {
                        type: 'checkbox',
                        label: 'Festival',
                        filter: (data, value) => data.diffusion_festival_nom
                    }
                ]
            },
            {
                type: 'number',
                label: '% de spectacles Jeune Public',
                min: 0,
                max: 100,
                value: 0,
                prefix: '>',
                suffix: '%',
                filter: (data, value) => data.diffusion_pourcentage_jp >= value
            },
            {
                type: 'checklist',
                label: 'Tranches d\'âge du public',
                choices: {
                    "diffusion_0_3ans": '0 – 3 ans',
                    "diffusion_3_6ans": '3 – 6 ans',
                    "diffusion_6_12ans": '6 – 12 ans',
                    "diffusion_12ans": 'À partir de 12 ans',
                },
                filter: (data, value) => value.some(x => data[x] > 0)
            },
            {
                type: 'number',
                label: 'Nombre de places Jeune Public',
                min: 0,
                max: Math.max(...markers.map(x => x.diffusion_places_jp || 0)),
                value: 0,
                filter: (data, value) => data.diffusion_places_jp >= value
            },
            {
                type: 'checklist',
                label: 'Temps d\'action culturelle',
                choices: {
                    "actionculturelle_scolaire": "Scolaire",
                    "actionculturelle_periscolaire": "Périscolaire",
                    "actionculturelle_extrascolaire": "Extrascolaire",
                },
                filter: (data, value) => value.some(x => data[x] === 'Oui')
            },
        ]
    },
    {
        type: 'separator'
    },
    {
        type: 'group',
        label: 'Réseaux',
        icon: 'globe',
        reset: true,
        inclusive: true,
        filters: [
            {
                type: 'select',
                label: 'Choisir des réseaux Jeune Public',
                id: 'reseaux',
                choices: (()=>{
                    var c = {},
                        r = []
                    markers.forEach(x => r = r.concat(x.reseaux.split('\n')))
                    for (var i in r) {
                        if (!c[r[i]] && r[i]) c[r[i]] = r[i]
                    }
                    return c
                })(),
                value: [],
                filter: (data, value) => value.some(x => data.reseaux.indexOf(x) !== -1),
                onChange: (value, filters, map)=>{
                    for (var c in filters.reseaux.choices) {
                        map.toggleLayer(c, value.includes(c))
                    }
                }
            },
        ]
    },


]
