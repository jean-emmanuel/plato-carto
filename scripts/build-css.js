var sass = require('node-sass'),
    autoprefixer = require('autoprefixer'),
    postcss = require('postcss'),
    path = require('path'),
    send = require('./ipc'),
    fs = require('fs')

var inputPath = path.resolve(__dirname + '/../src/scss/index.scss'),
    outputPath = path.resolve(__dirname + '/../app/styles.css'),
    includes = ['/../node_modules/leaflet/dist/', '/../node_modules/leaflet.markercluster/dist/', '/../node_modules/normalize.css/', '/../node_modules/materialize-css/sass/', '/../node_modules/materialize-css/sass/components/forms/', '/../node_modules/materialize-css/sass/components/']

var result = sass.renderSync({
    file: inputPath,
    includePaths: includes.map(f => path.resolve(__dirname + f)),
    outputStyle: 'compressed',
})

postcss([autoprefixer]).process(result.css).then(function (result) {

    result.warnings().forEach(function (warn) {
        console.warn(warn.toString())
    })

    // result = result.css

    fs.writeFileSync(outputPath, result.css)
    send('reloadCss')

})



// console.log(result.css.toString())
