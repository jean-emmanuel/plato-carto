var request = require('request')
var data = require('../data/compagnies.json')
var fs = require('fs'),
    path = require('path')

var i = 0,
    interval = setInterval(()=>{

    if (i === data.length) {
        clearInterval(interval)
        return end()
    }

    var item = data[i]
    request({
        url: encodeURI(`https://nominatim.openstreetmap.org/search?format=json&q=${item.adresse}, ${item.codepostal} ${item.ville}`),
        json:true,
        headers: {
          'User-Agent': 'request'
        }
    }, (err, resp, body)=>{
        if (err) throw err
        if (body.length && body[0].lat)  {
            item.coords = [parseFloat(body[0].lat), parseFloat(body[0].lon)]
        } else {
            console.log(`\nFAIL: ${item.adresse}, ${item.codepostal} ${item.ville}`)
            console.log(body)

        }
    })

    i++

}, 1000)


function end() {
    fs.writeFileSync('out.json', JSON.stringify(data, null, '  '))
    console.log('OK !')
}
