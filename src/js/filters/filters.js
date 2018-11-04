var html = require('nanohtml'),
    {Filter} = require('./base'),
    materialize = require('materialize-css')



class Separator extends Filter {

    constructor(o) {

        var options = {
            input: false,
            label: false,
            ...o,
            type: 'separator'
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
            icon: o.collapse ? 'chevron-down' : o.icon,
            type: 'group'
        }

        super(options)

        if (options.collapse) {
            this.html.classList.add('collapse')
            this.label.classList.add('waves-effect')
            this.label.addEventListener('click', ()=>{
                this.html.classList.toggle('open')
            })
        }

    }

    checkInactive() {

        this.inactive = this.filters.every(x => x.inactive)
        this.html.classList.toggle('inactive', this.inactive )

    }

}

class Text extends Filter {

    constructor(o) {

        var options = {
            input: html`<input type="text"/>`,
            value: '',
            ...o,
            class: o.class + ' input-field',
            type: 'text'
        }

        super(options)

        this.input.setAttribute('id', this.id)
        this.input.addEventListener('keydown', (e)=>{
            if (e.keyCode == 13) {
                e.preventDefault()
                this.input.blur()
            }
        })

        this.input.addEventListener('input', (e)=>{
            e.stopPropagation()
            this.onChange(e)
        })

    }

    reset() {
        super.reset()
        this.input.blur()
        this.label.classList.remove('active')
    }

    setValue(value) {

        super.setValue(value)
        this.input.value = value

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
            value: false,
            ...o,
            label: false,
            type: 'checkbox'
        }

        super(options)

        this.checkbox = this.input.getElementsByTagName('input')[0]
        this.checkbox.setAttribute('id', this.id)
        this.checkbox.checked = this.value

    }

    setValue(value) {

        super.setValue(value)
        this.checkbox.checked = !!value

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
            ...o,
            type: 'checklist'
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

    reset() {
        super.reset()
        for (var k in this.checkboxes) {
            this.checkboxes[k].checkInactive()
        }
    }

    setValue(value) {

        super.setValue(value)
        for (var k in this.checkboxes) {
            this.checkboxes[k].setValue(this.value.indexOf(k) !== -1)
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
            ...o,
            type: 'radio'
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

    setValue(value) {

        super.setValue(value)
        for (var k in this.checkboxes) {
            this.checkboxes[k].checked = this.value === k
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
            ...o,
            type: 'checkradio'
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

        if (Object.keys(this.choices).length === 2) {
            this.html.classList.add('row')
        }


    }

    setValue(value) {

        super.setValue(value)
        for (var k in this.checkboxes) {
            this.checkboxes[k].setValue(this.value === k)
        }

    }

    reset() {
        super.reset()
        for (var k in this.checkboxes) {
            this.checkboxes[k].checkInactive()
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

class Select extends Filter {

    constructor(o) {

        var options = {
            input: html`<select multiple></select>`,
            value: [],
            choices: {a: 'choice a', b: 'choice b'},
            single: false,
            ...o,
            type: 'select'
        }

        super(options)

        this.choices = options.choices

        this.html.removeChild(this.label)
        this.input.appendChild(html`<option value="" disabled selected>${options.label}</option>`)

        this.checkboxes = {}
        for (var k in this.choices) {
            this.checkboxes[k] = html`
                <option value="${k}">${this.choices[k]}</option>
            `
            this.input.appendChild(this.checkboxes[k])
        }

        this.mSelect = null
        setTimeout(()=>{
            this.mSelect = materialize.FormSelect.init(this.input)
        })


    }

    setValue(value) {

        super.setValue(value)
        for (var k in this.checkboxes) {
            this.checkboxes[k].selected = this.value.indexOf(k) !== -1
        }
        this.mSelect._setSelectedStates()
        this.mSelect._setValueToInput()


    }

    onChange(e) {

        var value = this.mSelect.getSelectedValues()

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
            ...o,
            type: 'number'
        }

        super(options)

        this.prefix = options.prefix ? options.prefix.trim() + ' ' : ''
        this.suffix = options.suffix ? ' ' + options.suffix.trim() : ''

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

        this.mRange = materialize.Range.init(this.slider)

    }

    updateHelper() {

        this.helper.innerHTML = this.prefix + this.value + this.suffix

    }


    setValue(value) {

        this.mRange.el.value = value
        super.setValue(value)
        this.updateHelper()

    }

    onChange(e) {

        super.onChange(e, parseInt(this.slider.value))
        this.updateHelper()

    }

}



module.exports = {
    checkbox: CheckBox,
    checklist: CheckList,
    radio: Radio,
    checkradio: CheckRadio,
    select: Select,
    number: Number,
    group: Group,
    text: Text,
    separator: Separator
}
