var loading = document.getElementById('loading')

module.exports = batch

function progress(progress, total) {

    var state = progress / total

    loading.classList.toggle('loading', state !== 0)
    loading.setAttribute('style', `
        -webkit-transform: scale3d(${state}, 1, 1);
        -ms-transform: scale3d(${state}, 1, 1);
            transform: scale3d(${state}, 1, 1);
    `)

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
