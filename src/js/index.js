require('./reload')
require('./sidepanel')
require('./list')
require('./map')
require('./nav')
// require('./mobile')

var filterManager = require('./filters')
filterManager.onChange()
