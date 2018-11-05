var keyboardJS = require('keyboardjs'),
    html = require('nanohtml'),
    morph = require('nanomorph'),
    locale = require('../../config/locale'),
    map = require('./map'),
    modal = require('./modal'),
    batch = require('./batch'),
    templates = require('../../config/templates'),
    listElement = document.getElementById('list'),
    listCount = document.getElementById('list-count'),
    listContent = listElement.getElementsByClassName('list-content')[0],
    listToggle = document.getElementById('list-toggle'),
    open = false

var listEmpty = html`
    <div class="list-item">
        <p class="">${locale.noResults}</p>
    </div>`

function toggleList(state) {

    open = state !== undefined ? state : !open

    if (open) {
        updateList(open)
    } else {
        updateDom()
    }

}

function updateDom() {

    listElement.classList.toggle('opened', open)
    listToggle.classList.toggle('on', open)

    if (open) {
        listElement.classList.remove('hidden')
    } else {
        setTimeout(()=>{
            listElement.classList.add('hidden')
        }, 250)
    }

}

listToggle.addEventListener('click', ()=>{toggleList()})
keyboardJS.bind('f2', ()=>{toggleList()})

var queue = null,
    timeout = null

function process(){

    var markers = map.getVisibleMarkers()

    if (markers.every(x => x._score !== undefined)) {
        markers.sort((a, b) => b._score - a._score ||  a.nom[0].toLowerCase() > b.nom[0].toLowerCase())
    } else {
        markers.sort((a, b) => a.nom[0].toLowerCase() > b.nom[0].toLowerCase())
    }

    listCount.innerText = markers.length

    if (open) {

        if (markers.length) {

            var newTree = html`<div></div>`

            batch(markers, (data)=>{

                var desc = templates.listView(data),
                    more = html`<p class="btn-small waves-effect">${locale.more}</p>`

                more.addEventListener('click', ()=>{
                    modal(templates.modalTitle(data), templates.modalView(data))
                })
                desc.appendChild(more)
                newTree.appendChild(desc)

            }, ()=>{

                listContent.innerHTML = ''
                listContent.appendChild(newTree)
                updateDom()

            })

        } else {

            listContent.innerHTML = ''
            listContent.appendChild(listEmpty)

        }

    } else {
        updateDom()
    }

}

function updateList(){
    clearTimeout(timeout)
    timeout = setTimeout(process, 250)
}


module.exports = {
    update: updateList,
    toggle: toggleList
}
