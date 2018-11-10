var html = require('nanohtml'),
    store = require('./store'),
    materialize = require('materialize-css'),
    {deepEqual, deepCopy} = require('../utils'),
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

        this.defaultValue = options.value
        this.value = options.value
        this.parent = options.parent
        this.filterCallback = options.filter
        this.disabled = options.disabled
        this.inclusive = options.inclusive
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

        if (this.inactive) return true
        if (this.disabled && this.disabled(marker, this.value, store)) return true
        if (this.filterCallback && !this.filterCallback(marker, this.value, store)) return false

        if (this.inclusive) {
            return this.filters.filter(f => !f.inactive).some(f => f.applyFilter(marker))
        }

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
            if (options.icon) {
                var icon = html`<i class="fas fa-fw icon fa-${options.icon}"></i>`

            }
            this.label = html`<label for="${this.id}">${icon}<span>${options.label}</span></label>`
            this.html.appendChild(this.label)
            if (options.reset) {
                var reset = html`<i class="fas fa-trash reset"></i>`
                this.label.append(reset)
                reset.addEventListener('mousedown', (e)=>{
                    // e.preventDefault()
                    e.stopPropagation()
                })
                reset.addEventListener('touchstart', (e)=>{
                    // e.preventDefault()
                    e.stopPropagation()
                }, {passive: true})
                reset.addEventListener('click', (e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                    this.reset()
                    this.parent.onChange()
                })
            }

            if (options.help) {

                this.label.setAttribute('data-tooltip', options.help)
                 materialize.Tooltip.init(this.label, {
                    position: 'right',
                    margin: 15,
                    enterDelay: 750
                })

            }

        }

        if (options.input) {

            this.input = options.input
            this.html.appendChild(this.input)
            this.input.addEventListener('change', (e)=>{
                e.stopPropagation()
                this.onChange(e)
            })

        }

        this.inactive = false
        this.checkInactive()

        store[this.id] = this

    }

    setValue(value) {

        this.value = value

    }

    reset() {

        this.setValue(deepCopy(this.defaultValue))
        for (var i in this.filters) {
            this.filters[i].reset()
        }
        this.checkInactive()

    }

    checkInactive() {

        this.inactive = deepEqual(this.defaultValue, this.value) && this.filters.every(x => x.inactive)
        this.html.classList.toggle('inactive', this.inactive )

    }

    onChange(e, value) {

        if (deepEqual(this.value, value)) return

        if (value !== undefined) this.value = value

        this.checkInactive()

        this.parent.onChange(e, undefined)

    }

}

module.exports = {
    Filter,
    FilterBase
}

filterTypes = require('./filters')
