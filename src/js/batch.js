var loading = document.getElementById('loading'),
    state

module.exports = batch

function progress(progress, total) {

    var newState = Math.round(progress / total * 4)

    if (newState !== state) {
        loading.classList.remove('state-' + state)
        state = newState
        loading.classList.add('state-' + state)
    }

}

function batch(array, cb, endCb) {

    var i = 0,
        length = array.length

    function next() {

        var data = array[i]
        cb(data, i)
        i++

        progress(i, length)

        if (i === length) {
            endCb()
            progress(0, 1)
        } else {
            setTimeout(next)
        }

    }

    next()

}
