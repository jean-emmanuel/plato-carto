var materialize = require('materialize-css'),
    modalElement = document.getElementById('modal'),
    modalCloser = modalElement.getElementsByClassName('closer')[0],
    modalContent = modalElement.getElementsByClassName('modal-content')[0],
    modalTitle = modalElement.getElementsByClassName('modal-title')[0],
    modal = materialize.Modal.init(modalElement)

modalCloser.addEventListener('click', (e)=>{
    e.preventDefault()
    setTimeout(()=>{
        modal.close()
    }, 200)
})

function resizeTitle(){
    var h = modalTitle.offsetHeight + 6 + 'px'
    modalElement.style.paddingTop = h
}

module.exports = (title, content) => {

    modalTitle.innerHTML = ''
    modalContent.innerHTML = ''
    modalTitle.appendChild(title)
    modalContent.appendChild(content)
    modal.open()
    modalContent.scrollTop = 0

    setTimeout(()=>{
        resizeTitle()
    })

}
