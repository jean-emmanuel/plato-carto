var html = require('nanohtml'),
    {Filter} = require('./base'),
    materialize = require('materialize-css')



class Separator extends Filter {

    constructor(o) {

        var options = {
            input: false,
            label: false,
            ...o,
        }

        super(options)

    }

}

class Group extends Filter {

    constructor(o) {

        var options = {
            input: false,
            // label: false,
            ...o,
        }

        super(options)

    }

}

class Text extends Filter {

    constructor(o) {

        var options = {
            input: html`<input type="text"/>`,
            ...o,
            class: o.class + ' input-field'
        }

        super(options)

        this.input.setAttribute('id', this.id)
        this.input.addEventListener('input', (e)=>{
            e.stopPropagation()
            this.onChange(e)
        })

    }

    onChange(e) {

        super.onChange(e, this.input.value)

    }

}


class CheckBox extends Filter {

    constructor(o) {

        var options = {
            input: html`
                <label>
                    <input type="checkbox"/>
                    <span>${o.label}</span>
                </label>`,
            ...o,
            label: false,
        }

        super(options)

        this.checkbox = this.input.getElementsByTagName('input')[0]
        this.checkbox.setAttribute('id', this.id)
        this.checkbox.checked = this.value

    }

    onChange(e) {

        super.onChange(e, !!this.checkbox.checked)

    }

}

class CheckList extends Filter {

    constructor(o) {

        var options = {
            input: html`<div class="filter"></div>`,
            value: [],
            choices: {a: 'choice a', b: 'choice b'},
            single: false,
            ...o
        }

        super(options)

        this.choices = options.choices
        this.checkboxes = {}
        for (var k in this.choices) {
            this.checkboxes[k] = new CheckBox({
                label: options.choices[k],
                value: this.value.indexOf(k) > -1,
                parent: this
            })
            this.input.appendChild(this.checkboxes[k].html)
        }


    }

    onChange(e) {

        var value = []
        for (var k in this.choices) {
            if (this.checkboxes[k].value) value.push(k)
        }

        super.onChange(e, value)

    }

}

class Radio extends Filter {

    constructor(o) {

        var options = {
            input: html`<div class="filter"></div>`,
            value: null,
            choices: {a: 'choice a', b: 'choice b'},
            ...o
        }

        super(options)

        this.choices = options.choices
        this.checkboxes = {}
        for (var k in this.choices) {
            var item = html`
                <label>
                    <input class="with-gap" name="${this.id}" type="radio" value="${k}" ${this.value === k ? 'checked' : ''}/>
                    <span>${this.choices[k]}</span>
                </label>
            `
            this.checkboxes[k] = item.getElementsByTagName('input')[0]
            this.input.appendChild(item)
        }


    }

    onChange(e) {

        var value = null
        for (var k in this.choices) {
            if (this.checkboxes[k].checked) value = k
        }

        super.onChange(e, value)

    }
}

class CheckRadio extends Filter {

    constructor(o) {

        var options = {
            input: html`<div class="filter"></div>`,
            value: null,
            choices: {a: 'choice a', b: 'choice b'},
            ...o
        }

        super(options)

        this.disabled = s => this.value === null
        this.choices = options.choices
        this.checkboxes = {}
        for (var k in this.choices) {
            this.checkboxes[k] = new CheckBox({
                label: options.choices[k],
                value: this.value === k,
                parent: this
            })
            this.input.appendChild(this.checkboxes[k].html)
        }


    }

    onChange(e) {

        var value = null
        for (var k in this.choices) {
            if (this.checkboxes[k].checkbox === e.target) {
                if (this.checkboxes[k].value) {
                    value = k
                }
            } else {
                this.checkboxes[k].checkbox.checked = false
            }
        }

        super.onChange(e, value)

    }

}

class Number extends Filter {

    constructor(o) {

        var options = {
            input: html`
                <div class="range-field">
                    <input type="range"/>
                    <span class="helper"></span>
                </div>`,
            unit: '',
            value:0,
            min: 0,
            max: 100,
            ...o
        }

        super(options)

        this.unit = options.unit ? ' ' + options.unit.trim() : ''

        this.slider = this.input.getElementsByTagName('input')[0]
        this.slider.setAttribute('id', this.id)
        this.slider.value = options.value
        this.slider.min = options.min
        this.slider.max = options.max

        this.helper = this.input.getElementsByTagName('span')[0]
        this.updateHelper()

        this.input.addEventListener('input', (e)=>{
             this.onChange(e)
        })

        materialize.Range.init(this.slider)

    }

    updateHelper() {

        this.helper.innerHTML = this.slider.value + this.unit

    }

    onChange(e) {

        this.updateHelper()
        super.onChange(e, parseInt(this.slider.value))

    }

}



module.exports = {
    checkbox: CheckBox,
    checklist: CheckList,
    radio: Radio,
    checkradio: CheckRadio,
    number: Number,
    group: Group,
    text: Text,
    separator: Separator
}
