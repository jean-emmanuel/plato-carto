var filtersData = require('../../../config/filters'),
    {FilterBase} = require('./base'),
    map = require('../map'),
    list = require('../list')


class FilterManager extends FilterBase {

    constructor(options) {

        super(options)

    }

    onChange() {

        map.drawMarkers(this.applyFilter.bind(this))
        list.update()

    }

}

module.exports = new FilterManager({filters: filtersData})
