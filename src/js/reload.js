function connect() {

    var ws = new WebSocket('ws://127.0.0.1:8080/webPage')

    ws.onmessage = (message)=>{
        try {
            var [e, data] = JSON.parse(message.data)
            cb(e, data)
        } catch(e) {
            console.error('Error parsing message ' + message.data)
        }
    }

    ws.onclose = ()=>{
        console.log('Reconnecting autoreload socket...')
        connect()
    }


}


function cb(e, data) {

    switch(e) {
        case 'reload':
        window.location = window.location
        return

        case 'reloadCss':
        var queryString = '?reload=' + Date.now()
        document.querySelectorAll('link[href*="styles.css"]').forEach((el)=>{
            el.href = el.href.replace(/\?.*|$/, queryString)
        })
        return
    }

}

connect()
