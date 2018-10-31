var materialize = require('materialize-css'),
    modalElement = document.getElementById('modal'),
    modalContent = modalElement.getElementsByClassName('modal-content')[0],
    modal = materialize.Modal.init(modalElement)


module.exports = (html) => {

    modalContent.innerHTML = ''
    modalContent.appendChild(html)
    modal.open()

}
