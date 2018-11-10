var modal = require('./modal'),
    filterManager = require('./filters'),
    templates = require('../../config/templates'),
    materialize = require('materialize-css'),
    screenfull = require('screenfull'),
    html = require('nanohtml')


// tooltips

materialize.Tooltip.init(document.getElementById('nav').querySelectorAll('[data-tooltip]'), {
   position: 'bottom',
   enterDelay: 750
})

// save

// materialize.Dropdown.init(document.getElementById('save'), {
//     container: document.body,
//     align: 'right'
//     constrainWidth: false,
// })

// aide

// document.getElementById('help').addEventListener('click', (e)=>{
//     e.preventDefault()
//     modal(templates.helpTitle(), templates.help())
// })

// infos

document.getElementById('infos').addEventListener('click', (e)=>{
    e.preventDefault()
    modal(templates.infosTitle(), templates.infos())
})

// fullscreen

if (screenfull.enabled && navigator && navigator.platform && !navigator.platform.match(/iPhone|iPod|iPad/)) {
    document.getElementById('fullscreen').addEventListener('click', (e)=>{
        e.preventDefault()
        screenfull.toggle()
    })
} else {
    document.getElementById('fullscreen').style.display = 'none'
}
