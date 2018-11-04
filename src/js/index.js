require('./reload')
require('./sidepanel')
require('./list')
require('./map')
var modal = require('./modal')
var filterManager = require('./filters')
var templates = require('../../config/templates')


document.getElementById('infos').addEventListener('click', ()=>{
    modal(templates.infosTitle(), templates.infos())
})

filterManager.onChange()
