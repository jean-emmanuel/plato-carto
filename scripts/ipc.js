var WS = require('../node_modules/ws')

function send(msg, data){
    var ipc = new WS('ws://127.0.0.1:8080/dev')
    ipc.on('error', ()=>{})
    ipc.on('open', ()=>{
        ipc.send(JSON.stringify([msg, data]))
        ipc.close()
    })
}

module.exports = send
