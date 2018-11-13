var html =require('nanohtml'),
    raw = require('nanohtml/raw'),
    locale = require('./locale'),
    reseaux = require('../data/2018/reseaux')

module.exports = {
    listView: (item) => {

        return html`
            <div class="list-item">
                <h3 class="header">
                    ${item.nom} <span class="chip">${item._type}</span>
                </h3>
                <p>
                    <i data-coords="${item.coords}" class="fas fa-fw fa-map-marker-alt ${item._type === 'structure' ? 'accent' : ''}"></i> ${item.adresse}, ${item.codepostal} ${item.ville}<br/>
                    ${item.www ?
                        html`<span><i class="fas fa-fw fa-globe"></i> <a href="${item.www}" target="_blank">${item.www}</a><br/></span>` : ''
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

    modalTitle: (item) => html`
        <span class="${item.nom.length > 20 ? 'long' : ''}">${item.nom} <span class="chip">${item._type}</span></span>
    `,

    modalView: (item) => {

        if (item._type === 'structure') {

            return html`
                <div>
                    <p>
                        <i data-coords="${item.coords}" class="fas fa-fw fa-map-marker-alt accent"></i> ${item.adresse}, ${item.codepostal} ${item.ville}<br/>
                        ${item.www ?
                            html`<span><i class="fas fa-fw fa-globe"></i> <a href="${item.www}" target="_blank">${item.www}</a><br/></span>` : ''
                        }
                        ${item.mail ?
                            html`<span><i class="fas fa-fw fa-at"></i> <a href="mailto:${item.mail}">${item.mail}</a><br/></span>` : ''
                        }
                        ${item.telephone ?
                            html`<span><i class="fas fa-fw fa-phone"></i> ${item.telephone}<br/></span>` : ''
                        }

                    </p>
                    <p>
                        <label>Type de structure</label>
                        <span class="chip">${item.type} ${item.conventionnement}</span>
                    </p>

                    ${item.reseaux ? html`
                        <p>
                        <label>Membre de</label>
                        ${item.reseaux.split('\n').map(r => html`
                            <span class="chip">
                                ${
                                    reseaux[r] ? html`<a href="${reseaux[r]}" target="_blank">${r}</a>` : r
                                }
                            </span>
                        `)}
                        </p>`
                        : ''
                    }

                    ${item.aidecreation_preachat || item.aidecreation_coprod || item.aidecreation_residence ? html`
                        <div class="bloc bloc-1">
                            <h4>Aide à la création jeune public 2017-2018</h4>
                            ${item.aidecreation_preachat ? html`
                                <p><b>${item.aidecreation_preachat}</b> représentation${item.aidecreation_preachat > 1 ? 's' : ''} en préachat</p>
                            ` : ''}
                            ${item.aidecreation_coprod ? html`
                                <p><b>${item.aidecreation_coprod}</b> création${item.aidecreation_coprod > 1 ? 's' : ''} en (co)production</p>
                            ` : ''}
                            ${item.aidecreation_residence ? html`
                                <p><b>${item.aidecreation_residence}</b> équipe${item.aidecreation_residence > 1 ? 's' : ''} en résidence</p>
                            ` : ''}
                        </div>
                    ` : ''}

                    <div class="bloc bloc-2">
                        <h4>Diffusion 2017-2018</h4>
                        ${item.diffusion_festival_nom ?
                            html`<p>Festival jeune public : <b>${item.diffusion_festival_nom}</b></p>` : ''
                        }
                        ${item.diffusion_total ?
                            html`<p><b>${item.diffusion_total}</b> spectacles programmés dont <b>${item.diffusion_jp || 0}</b> jeune public</p>` : ''
                        }

                        ${item.diffusion_0_3ans ?
                            html`<p><b>${item.diffusion_0_3ans}</b> spectacle${item.diffusion_0_3ans > 1 ? 's' : ''} 0-3 ans` : ''
                        }
                        ${item.diffusion_3_6ans ?
                            html`<p><b>${item.diffusion_3_6ans}</b> spectacle${item.diffusion_3_6ans > 1 ? 's' : ''} 3-6 ans` : ''
                        }
                        ${item.diffusion_6_12ans ?
                            html`<p><b>${item.diffusion_6_12ans}</b> spectacle${item.diffusion_6_12ans > 1 ? 's' : ''} 6-12 ans` : ''
                        }
                        ${item.diffusion_12ans ?
                            html`<p><b>${item.diffusion_12ans}</b> spectacle${item.diffusion_12ans > 1 ? 's' : ''} à partir de 12 ans` : ''
                        }
                        ${item.diffusion_places_jp ?
                            html`<p><b>${item.diffusion_places_jp}</b> places proposées pour toutes les représentations jeune public</p>` : ''
                        }

                    </div>

                    ${item.actionculturelle_scolaire === 'Oui' || item.actionculturelle_periscolaire === 'Oui' || item.actionculturelle_extrascolaire === 'Oui' ? html`
                        <div class="bloc bloc-3">
                            <h4>Action culturelle</h4>
                            ${item.actionculturelle_scolaire === 'Oui' ?
                                html`<span class="chip">Scolaire</span>` : ''
                            }
                            ${item.actionculturelle_periscolaire === 'Oui' ?
                                html`<span class="chip">Périscolaire</span>` : ''
                            }
                            ${item.actionculturelle_extrascolaire === 'Oui' ?
                                html`<span class="chip">Extrascolaire</span>` : ''
                            }
                        </div>
                    ` : ''}
                </div>
            `

        } else {

            var reseaux_diff = {
                "diffusion_reseaux_sn": "Scène nationale",
                "diffusion_reseaux_conv": "Scène conventionnée",
                "diffusion_reseaux_ccn": "Centre chorégraphique national",
                "diffusion_reseaux_cdn": "Centre Dramatique National",
                "diffusion_reseaux_thm": "Théâtre municipal",
                "diffusion_reseaux_epci": "Communauté de communes",
                "diffusion_reseaux_centreculturel": "Centre culturel",
                "diffusion_reseaux_mediatheque": "Médiathèque",
                "diffusion_reseaux_autre": item.diffusion_reseaux_autre
            }, reseaux_diff_compagnie = Object.keys(reseaux_diff).filter(x => x === "diffusion_reseaux_autre" ? item[x] : item[x] !== 'Non')

            var formes_art = {
                "formesartistiques_theatre": "Théâtre",
                "formesartistiques_danse": "Danse",
                "formesartistiques_cirque": "Cirque",
                "formesartistiques_musique": "Musique",
                "formesartistiques_marionette": "Marionnette",
                "formesartistiques_cinema": "Cinéma",
                "formesartistiques_theatreobjet": "Théâtre d'objet",
                "formesartistiques_autre": item.formesartistiques_autre
            }, formes_art_compagnie = Object.keys(formes_art).filter(x => x === "formesartistiques_autre" ? item[x] : item[x] !== 'Non')

            var ages = {
                "agecible_0_3ans": "0-3 ans",
                "agecible_3_6ans": "3-6 ans",
                "agecible_6_12ans": "6-12 ans",
                "agecible_12ans": "12 ans et +",
            }, ages_compagnie = Object.keys(ages).filter(x => item[x] === 'Oui')



            return html`
                <div>
                    <p>
                        <i data-coords="${item.coords}" class="fas fa-fw fa-map-marker-alt"></i> ${item.adresse}, ${item.codepostal} ${item.ville}<br/>
                        ${item.www ?
                            html`<span><i class="fas fa-fw fa-globe"></i> <a href="${item.www}" target="_blank">${item.www}</a><br/></span>` : ''
                        }
                        ${item.mail ?
                            html`<span><i class="fas fa-fw fa-at"></i> <a href="mailto:${item.mail}">${item.mail}</a><br/></span>` : ''
                        }
                        ${item.telephone ?
                            html`<span><i class="fas fa-fw fa-phone"></i> ${item.telephone}<br/></span>` : ''
                        }
                        ${item.annee ?
                            html`<span class="grey-text"><i class="fas fa-fw fa-info-circle"></i> Création en ${item.annee}<br/></span>` : ''
                        }
                    </p>
                    ${item.reseaux ? html`
                        <p>
                            <label>Membre de</label>
                            ${item.reseaux.split('\n').map(r => html`
                                <span class="chip">
                                ${
                                    reseaux[r] ? html`<a href="${reseaux[r]}" target="_blank">${r}</a>` : r
                                }
                                </span>
                            `)}
                        </p>`
                        : ''
                    }
                    ${item.lieu_creation  === 'Oui'  || item.lieu_diffusion  === 'Oui' ? html`
                        <p>
                            <label>Dispose d'un lieu de${raw('&nbsp;')}</label>
                            ${item.lieu_creation === 'Oui' ? html`<span class="chip">création</span>` : ''}
                            ${item.lieu_diffusion  === 'Oui' ? html`<span class="chip">diffusion</span>` : ''}
                        </p>`
                        : ''
                    }
                    ${item.convention === 'Oui' ? html`
                        <p>
                            <label>Compagnie</label>
                            <span class="chip">conventionnée</span>
                        </p>` : ''
                    }
                    ${item.structure_associee ? html`
                        <p>
                            <label>Associée à</label>
                            <span class="chip">${item.structure_associee.replace(/\n/g, ' / ')}</span>
                        </p>` : ''
                    }

                    <div class="bloc bloc-1">
                        <h4>Création / Diffusion depuis 2016</h4>
                        ${item.creation ?
                            html`<p><b>${item.creation}</b> spectacle${item.creation > 1 ? 's' : ''} jeune public créé${item.creation > 1 ? 's' : ''} depuis 2016</p>` : ''
                        }
                        ${item.diffusion ?
                            html`<p><b>${item.diffusion}</b> spectacle${item.diffusion > 1 ? 's' : ''} jeune public en diffusion depuis 2016</p>` : ''
                        }
                    </div>
                    <div class="bloc bloc-2">
                        <h4>Diffusion en 2017-2018</h4>
                        ${item.diffusion_region ?
                            html`<p><b>${item.diffusion_region}%</b> de représentations jouées en Pays de La Loire</p>` : ''
                        }
                        ${item.diffusion_france ?
                            html`<p><b>${item.diffusion_france}%</b> de représentations jouées en France (hors Pays de la Loire)</p>` : ''
                        }
                        ${item.diffusion_monde ?
                            html`<p><b>${item.diffusion_monde}%</b> de représentations jouées à l’international</p>` : ''
                        }


                        ${reseaux_diff_compagnie.length ? html`
                            <div>
                                <h4>Réseaux de diffusion des spectacles jeune public</h4>
                                ${reseaux_diff_compagnie.map(reseau => html`
                                    <span class="chip">
                                        ${reseaux_diff[reseau]}
                                    </span>`
                                )}
                            </div>` : ''
                        }
                    </div>

                    <div class="bloc bloc-3">

                        ${formes_art_compagnie.length ? html`
                            <div>
                                <h4>Formes artistiques dominantes</h4>
                                ${formes_art_compagnie.map(x => html`
                                    <span class="chip">
                                        ${formes_art[x]}
                                    </span>`
                                )}
                            </div>
                        `  : ''}

                        ${ages_compagnie.length ? html`
                            <div>
                                <h4>Spectacles créés pour les</h4>
                                ${ages_compagnie.map(x => html`
                                    <span class="chip">
                                        ${ages[x]}
                                    </span>`
                                )}
                            </div>
                        `  : ''}
                    </div>


                </div>
            `

        }

    },

    infosTitle: (item) => html`
        <span>
            ${locale.about}
        </span>
    `,

    infos: (item) => html`
        <div>

            <h4>Mentions Légales</h4>

            <ul class="browser-default">
                <li>Hébergement: Jimdo</li>
                <li>Publication: PlatO</li>
                <li>Réalisation: <a href="https://ammd.net" target="_blank">Jeannot / AMMD</a></li>
            </ul>

            <h4>Données</h4>

            <p>
                Les données utilisées pour la réalisation de cette carte sont
                publiées sous licence <a href="https://spdx.org/licenses/ODbL-1.0.html#licenseText" target="_blank">ODC Open Database License (ODbL)</a>
                à l'adresse <a href="https://github.com/jean-emmanuel/plato-carto/tree/master/data" target="_blank">https://github.com/jean-emmanuel/plato-carto/tree/master/data</a>.
            </p>

            <h4>Code source</h4>

            <p>Cette carte à été réalisée uniquement avec des logiciels libres.</p>
            <p>
                Son code source est publié sous licence <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">GNU/GPL-3.0</a>
                sur <a href="https://github.com/jean-emmanuel/plato-carto" target="_blank">https://github.com/jean-emmanuel/plato-carto</a>.
            </p>
            <p>
                Certaines fonctionnalités ont été librement inspirées de la carte <a href="https://presdecheznous.fr" target="_blank">presdecheznous.fr</a>.
            </p>

        </div>
    `,

    helpTitle: (item) => html`
        <span>
            ${locale.help}
        </span>
    `,

    help: (item) => html`
        <div>
            Ici, le guide...
        </div>
    `
}
