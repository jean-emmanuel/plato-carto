var keyboardJS = require('keyboardjs'),
    html = require('nanohtml'),
    morph = require('nanomorph'),
    locale = require('../../config/locale'),
    map = require('./map'),
    modal = require('./modal'),
    batch = require('./batch'),
    templates = require('../../config/templates'),
    list = document.getElementById('list'),
    listCount = document.getElementById('list-count'),
    listContent = list.getElementsByClassName('list-content')[0],
    listToggle = document.getElementById('list-toggle'),
    open = false

var listEmpty = html`
    <div class="list-item">
        <p class="">${locale.noResults}</p>
    </div>`

function toggleList() {

    open = !open
    updateList(open)

}

function updateDom() {

    list.classList.toggle('opened', open)
    listToggle.classList.toggle('on', open)

    if (open) {
        list.classList.remove('hidden')
    } else {
        setTimeout(()=>{
            list.classList.add('hidden')
        }, 250)
    }

}

listToggle.addEventListener('click', toggleList)
keyboardJS.bind('f2', toggleList)

var queue = null,
    timeout = null

function process(){

    var markers = map.getVisibleMarkers()
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


module.exports = updateList
