var browserify = require('browserify'),
    nanohtml = require('nanohtml'),
    uglifyify = require('uglifyify'),
    through = require('through'),
    minimatch = require('minimatch').Minimatch,
    licensify = require('licensify'),
    babelify = require('babelify'),
    exorcist = require('exorcist'),
    path = require('path'),
    fs = require('fs'),
    prod = process.argv.indexOf('--prod') != -1,
    fast = process.argv.indexOf('--fast') != -1,
    watch = process.argv.indexOf('--watch') != -1,
    autoRefresh = process.argv.indexOf('--auto-refresh') != -1,
    send = require('./ipc'),
    b

var inputPath = path.resolve(__dirname + '/../src/js/index.js'),
    outputPath = path.resolve(__dirname + '/../app/scripts.js')


var ignoreList = ['**/*.min.js', '**/jquery.ui.js'],
    ignoreWrapper = function(transform){
        return function(file, opts){
             if (
                ignoreList.some(function(pattern) {
                    var match = minimatch(pattern)
                    return match.match(file)
                })
            ) {
                return through()
            } else {
                return transform(file, opts)
            }
        }
    }

if (prod) console.warn('\x1b[36m%s\x1b[0m', 'Building minified js bundle for production... This may take a while... ')


var plugins = [licensify]

if (watch) plugins.push(require('watchify'))

b = browserify(inputPath, {
    debug:!fast,
    insertGlobals:fast,
    noParse: ignoreList,
    cache: {},// needed by watchify
    packageCache: {},// needed by watchify
    plugin: plugins
 })

b.transform(ignoreWrapper(babelify), {presets: ["env"]})
b.transform(nanohtml)
if (prod) b = b.transform(ignoreWrapper(uglifyify), {global: true})


if (watch) {
    b.on('update', bundle)
    b.on('log', function(msg) {console.warn('\x1b[36m%s\x1b[0m', msg)})
}

bundle()

function bundle() {

    var output =  b.bundle()

    if (watch) {
        output.on('end', (err)=> {
            console.log('Build successful, reloading...')
            send('reload')
        })
    }

    output.on('error', (err)=> {

        console.error(err.stack)

    })


    if (!fast) output = output.pipe(exorcist(outputPath + '.map'))

    output.pipe(fs.createWriteStream(outputPath))

}
