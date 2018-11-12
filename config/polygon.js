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

    var network = {
        type: 'FeatureCollection',
        features: [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "MultiLineString",
                    "coordinates": geoJSONSet.map(m => {
                        return [center, m.geometry.coordinates]
                    })
                }
            }
        ]
    }

    if (geoJSONSet.length > 3) {
        network.features.push(
            convex({
                type: "FeatureCollection",
                features: geoJSONSet
            })
        )
    }

    return network

}
