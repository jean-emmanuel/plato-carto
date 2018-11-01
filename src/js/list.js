var keyboardJS = require('keyboardjs'),
    html = require('nanohtml'),
    morph = require('nanomorph'),
    config = require('../../data/config'),
    map = require('./map'),
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

    var descriptions = map.getVisibleMarkersListViews()

    listCount.innerText = descriptions.length

    if (!listOpened) return

    if (descriptions.length) {

        var newTree = html`<div></div>`
        descriptions.forEach(d => newTree.appendChild(d))

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
