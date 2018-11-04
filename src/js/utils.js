module.exports = {
    deepEqual: function(a, b) {

        var ta = typeof a,
            tb = typeof b

        if (ta !== tb) {
            return false
        } else if (ta === 'object') {
            return JSON.stringify(a) === JSON.stringify(b)
        } else {
            return a === b
        }

    },
    deepCopy: function(obj, precision) {

        var copy = obj

        if (obj === null) {
            return obj
        }

        if (typeof obj === 'object') {
            copy = Array.isArray(obj) ? [] : {}
            for (let key in obj) {
                copy[key] = module.exports.deepCopy(obj[key])
            }
        } else if (typeof obj == 'number') {
            return copy
        }

        return copy

    },
}
