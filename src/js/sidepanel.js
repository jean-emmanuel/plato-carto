var keyboardJS = require('keyboardjs'),
    sidepanel = document.getElementById('sidepanel'),
    closer = document.getElementById('sidepanel-closer'),
    filterManager = require('./filters'),
    html = require('nanohtml')
    open = true


function toggleSidepanel() {

    open = !sidepanel.classList.toggle('sidepanel-closed')

    // force :hover out
    closer.classList.add('nohover')
    sidepanel.classList.add('transitioning')
    setTimeout(()=>{
        sidepanel.classList.remove('transitioning')
        closer.classList.remove('nohover')
    },250)

}

closer.addEventListener('click', (e)=>{
    e.preventDefault()
    toggleSidepanel()
})

keyboardJS.bind('f1', (e)=>{
    e.preventDefault()
    toggleSidepanel()
})


// prevent form focus scrolling
document.body.addEventListener('scroll', (e)=>{
    document.body.scrollTop = 0
})


var form = html`<div id="form"></div>`

function createForm(filters, parentNode) {


    for (var f of filters) {

        var element = html`
            <p class="filter">
                ${f.html}
            </p>`

        parentNode.appendChild(element)

        if (f.filters.length) {

            createForm(f.filters, f.html)

        }

    }

}

createForm(filterManager.filters, form)

sidepanel.appendChild(form)

if (window.innerWidth < 800) toggleSidepanel()

module.exports = {
    opened: () => open
}
