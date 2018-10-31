var WebSocket = require('ws'),
    wss = new WebSocket.Server({port: 8080}),
    webPage = []

wss.on('connection', function connection(ws, req) {

    var id = req.url.split('/').pop()

    if (id === 'webPage') {
        webPage.push(ws)
    }

    ws.on('message', function incoming(message) {

        try {
            var [e, data] = JSON.parse(message)
        } catch(e) {
            console.error('Error parsing message ' + message)
        }
        cb(e, data, ws)

    })

})

function cb(e, data, socket) {
    switch(e) {
        case 'reload':
            for (w of webPage) {
                if (w.readyState === w.OPEN)
                w.send('["reload"]')
            }
            webPage = []
            return
        case 'reloadCss':
            for (w of webPage) {
                if (w.readyState === w.OPEN)
                w.send('["reloadCss"]')
            }
            return
    }
}
