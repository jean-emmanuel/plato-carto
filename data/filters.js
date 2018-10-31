var LazySearch = require('lazy-search'),
    lazySearch = new LazySearch()

module.exports = [

    {
        label: 'Rechercher',
        type: 'text',
        value: '',
        filter: (data, value) => !value || lazySearch.find(data._string, value).length
    },
    // {
    //     type:'checkbox',
    //     id: 'disable_all',
    //     label: 'Désactiver les filtres',
    //     value: false
    // },
    //
    // {
    //     type: 'separator'
    // },
    // {
    //     type: 'group',
    //     disabled: (filters) => filters.disable_all.value,
    //     filters: [
    //         {
    //             type: 'checklist',
    //             label: 'Type d\'organisation',
    //             id: 'test',
    //             choices: {
    //                 compagnie: 'Compagnie',
    //                 structure: 'Structure'
    //             },
    //             value: ['compagnie', 'structure'],
    //             disabled: (store) => !store.test.value.length,
    //             filter: (marker, value) => value.indexOf(marker.type) > -1
    //         },
    //         {
    //             type: 'checkradio',
    //             label: 'Type d\'organisation',
    //             choices: {
    //                 compagnie: 'Compagnie',
    //                 structure: 'Structure'
    //             },
    //             filter: (marker, value) => value == marker.type,
    //         },
    //         {
    //             label: 'Taille',
    //             type: 'number',
    //             value: 0,
    //             unit: '$',
    //             filter: (marker, value) => marker.n > value
    //         },
    //     ]
    // }
    //
    //




]
