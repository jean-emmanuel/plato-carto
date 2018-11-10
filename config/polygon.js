var convex = require('turf-convex'),
    centroid = require('turf-centroid')

module.exports = (dataset) => {

    var geoJSONSet = dataset.map(m => ({
        ...m,
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": [m.coords[1], m.coords[0]]
        }
    }))
    var center = centroid({
        type: "FeatureCollection",
        features: geoJSONSet
    }).geometry.coordinates

    var polyline = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "MultiLineString",
            "coordinates": geoJSONSet.map(m => {
                return [center, m.geometry.coordinates]
            })
        }
    }

    return polyline

}
