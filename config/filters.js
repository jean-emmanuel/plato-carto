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
        type: 'checklist',
        label: 'Type d\'organisation',
        icon: 'home',
        reset: true,
        choices: {
            compagnie: 'Compagnie',
            structure: 'Structure'
        },
        filter: (data, value) => value.indexOf(data._type) !== -1
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
                label: 'Réseaux Jeune Publics',
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
                filter: (data, value) => value.some(x => data.reseaux.indexOf(x) !== -1)
            },
            {
                type: 'checkbox',
                label: 'Adhérent PlatO',
                filter: (data, value) => data.plato === 'Oui'
            },
        ]
    },
    {
        type: 'group',
        label: 'Structures',
        collapse: true,
        reset: true,
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
                filter: (data, value) => value.every(x => data[x] === 'Oui')
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
                filter: (data, value) => value.every(x => data[x] > 0)
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
                filter: (data, value) => value.every(x => data[x] === 'Oui')
            },
        ]
    },
    {
        type: 'group',
        label: 'Compagnies',
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
                filter: (data, value) => value.every(x => data[x] === 'Oui')
            },
        ]
    }


]
