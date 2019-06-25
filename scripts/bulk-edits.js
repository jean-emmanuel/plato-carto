var data = require('../data/2019_nodetail/compagnies.json')
var fs = require('fs')

function upperCaseAfter(str, char) {
    return str.trim().split(char).map(w =>
        w ? w[0].toUpperCase() + w.substr(1, w.length - 1) : w
    ).join(char)
}

data.forEach(item => {
    item.nom = item.nom.toLowerCase()
    item.nom = upperCaseAfter(item.nom, '\'')
    item.nom = upperCaseAfter(item.nom, '-')
    item.nom = upperCaseAfter(item.nom, ' ')

    item.ville = item.ville.toLowerCase()
    item.ville = upperCaseAfter(item.ville, '\'')
    item.ville = upperCaseAfter(item.ville, '-')
    item.ville = upperCaseAfter(item.ville, ' ')
})

end()


function end() {
    fs.writeFileSync('out.json', JSON.stringify(data, null, '  '))
    console.log('OK !')
}
