var keyboardJS = require('keyboardjs'),
    html = require('nanohtml'),
    morph = require('nanomorph'),
    config = require('../../data/config'),
    map = require('./map'),
    modal = require('./modal'),
    templates = require('../../data/templates'),
    list = document.getElementById('list'),
    listCount = document.getElementById('list-count'),
    listContent = list.getElementsByClassName('list-content')[0],
    listToggle = document.getElementById('list-toggle'),
    listOpened = false

function toggleList() {

    list.classList.toggle('opened')
    listOpened = listToggle.classList.toggle('on')

    if (listOpened) {
        list.classList.remove('hidden')
    } else {
        setTimeout(()=>{
            list.classList.add('hidden')
        }, 250)
    }

    if (listOpened) updateList()

}

listToggle.addEventListener('click', ()=>{
    toggleList()
})

keyboardJS.bind('f2', (e)=>{
    e.preventDefault()
    toggleList()
})


var listEmpty = html`
    <div class="list-item">
        <p class="">${config.locale.noResults}</p>
    </div>`,
    listTree = listEmpty

listContent.appendChild(listTree)

function updateList(){

    var markers = map.getVisibleMarkers()

    listCount.innerText = markers.length

    if (!listOpened) return

    if (markers.length) {

        var newTree = html`<div></div>`
        markers.forEach(data => {
            var desc = templates.listView(data),
                more = html`<p class="btn-small waves-effect">${config.locale.more}</p>`
            more.addEventListener('click', ()=>{
                modal(templates.modalView(data))
            })
            desc.appendChild(more)
        })

        // morph(listTree, newTree)
        listContent.innerHTML = ''
        listContent.appendChild(newTree)

    } else {

        listContent.innerHTML = ''
        listContent.appendChild(listEmpty)
        // morph(listTree, listEmpty)

    }


}

module.exports = updateList
