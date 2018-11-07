require('./reload')
require('./sidepanel')
require('./list')
require('./map')
require('./nav')
// require('./mobile')

var filterManager = require('./filters')
filterManager.onChange()


var loader = document.getElementById('init-loader')
window.onload = ()=>{
    setTimeout(()=>{
        loader.style.opacity = 0
        setTimeout(()=>{
            document.body.removeChild(loader)
        }, 350)
    }, 150)
}
