var html =require('nanohtml')

module.exports = (item) => {

    return html`
        <div class="list-item">
            <h3 class="header">${item.nom}</h3>
            <p>
                <i class="fas fa-fw fa-map-marker-alt"></i> ${item.adresse}, ${item.codepostal} ${item.ville}<br/>
                ${item.www ?
                    html`<span><i class="fas fa-fw fa-globe"></i> ${item.www}<br/></span>` : ''
                }
                ${item.mail ?
                    html`<span><i class="fas fa-fw fa-at"></i> ${item.mail}<br/></span>` : ''
                }
                ${item.telephone ?
                    html`<span><i class="fas fa-fw fa-phone"></i> ${item.telephone}<br/></span>` : ''
                }
            </p>
        </div>
    `

}
