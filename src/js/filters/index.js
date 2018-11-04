var filtersData = require('../../../config/filters'),
    {FilterBase} = require('./base'),
    map = require('../map'),
    updateList = require('../list')


class FilterManager extends FilterBase {

    constructor(options) {

        super(options)

    }

    onChange() {

        map.drawMarkers(this.applyFilter.bind(this))
        updateList()

    }

}

module.exports = new FilterManager({filters: filtersData})
