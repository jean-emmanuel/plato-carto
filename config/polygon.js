var convex = require('turf-convex')
module.exports = (dataset) => {

    if (dataset.length < 4) return null


    var geoJSONSet = dataset.map(m => ({
        ...m,
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": [m.coords[1], m.coords[0]]
        }
    }))


    return convex({
        type: "FeatureCollection",
        features: geoJSONSet
    })

}
