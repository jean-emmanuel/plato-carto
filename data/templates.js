var html =require('nanohtml')

module.exports = {
    listView: (item) => {

        return html`
            <div class="list-item">
                <h3 class="header">
                    ${item.nom} <span class="header-chip">${item._type}</span>
                </h3>
                <p>
                    <i class="fas fa-fw fa-map-marker-alt"></i> ${item.adresse}, ${item.codepostal} ${item.ville}<br/>
                    ${item.www ?
                        html`<span><i class="fas fa-fw fa-globe"></i> <a href="${item.www}">${item.www}</a><br/></span>` : ''
                    }
                    ${item.mail ?
                        html`<span><i class="fas fa-fw fa-at"></i> <a href="mailto:${item.mail}">${item.mail}</a><br/></span>` : ''
                    }
                    ${item.telephone ?
                        html`<span><i class="fas fa-fw fa-phone"></i> ${item.telephone}<br/></span>` : ''
                    }

                </p>
            </div>
        `

    },

    modalView: (item) => {
        return module.exports.listView(item)
    }

}
