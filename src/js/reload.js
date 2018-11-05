function connect() {

    var ws = new WebSocket('ws://' + window.location.host + ':8080/webPage')

    ws.onmessage = (message)=>{
        try {
            var [e, data] = JSON.parse(message.data)
            cb(e, data)
        } catch(e) {
            console.error('Error parsing message ' + message.data)
        }
    }

    ws.onclose = ()=>{
        setTimeout(()=>{
            console.log('Reconnecting autoreload socket...')
            connect()
        }, 1000)
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

if (window.location.host.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]/)) connect()
