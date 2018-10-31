var html = require('nanohtml'),
    store = require('./store'),
    filterTypes

class FilterBase {

    constructor(o) {

        var options = {
            value: null,
            parent: null,
            filters: [],
            filter: null,
            disabled: null,
            ...o
        }

        this.value = options.value
        this.parent = options.parent
        this.filterCallback = options.filter
        this.disabled = options.disabled
        this.filters = []

        for (var f of options.filters) {

            if (!filterTypes[f.type]) {
                console.log('Unknown filter type ' + f.type)
                continue
            }

            this.filters.push(new filterTypes[f.type]({
                ...f,
                parent: this
            }))

        }

    }

    applyFilter(marker) {

        if (this.disabled && this.disabled(store)) return true
        if (this.filterCallback && !this.filterCallback(marker, this.value, store)) return false
        return this.filters.every(f => f.applyFilter(marker))

    }

}

class Filter extends FilterBase {

    constructor(o) {

        var options = {
            id: ('f-' + Math.random()).replace('.', ''),
            html: html`<div class="${o.type} ${o.class ? o.class : ''}"></div>`,
            input: null,
            helper: null,
            label: false,
            ...o
        }

        super(options)

        this.id = options.id

        this.html = options.html

        if (options.label) {

            this.label = html`<label for="${this.id}">${options.label}</label>`
            this.html.appendChild(this.label)

        }

        if (options.input) {

            this.input = options.input
            this.html.appendChild(this.input)
            this.input.addEventListener('change', (e)=>{
                e.stopPropagation()
                this.onChange(e)
            })

        }

        store[this.id] = this

    }

    onChange(e, value) {

        if (value !== undefined) this.value = value
        this.parent.onChange(e, undefined)

    }

}

module.exports = {
    Filter,
    FilterBase
}

filterTypes = require('./filters')
