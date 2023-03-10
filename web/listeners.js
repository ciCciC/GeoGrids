const listenerFocusNet = async (map, hoveredStateId) => {
    const ids = ['routeMidden', 'routeLow']
    const sources = ['middenspanningskabels', 'laagspanningskabels']
    map.on('mousemove', ids, (e) => {

        if (e.features.length > 0) {
            const sourceName = e.features[0].source

            if (hoveredStateId !== null) {
                map.setFeatureState(
                    {source: sourceName, id: hoveredStateId},
                    {hover: false}
                )
            }

            hoveredStateId = e.features[0].id;

            map.setFeatureState(
                {source: sourceName, id: hoveredStateId},
                {hover: true}
            )
        }
    })

    map.on('mouseleave', ids, (e) => {
        if (hoveredStateId !== null) {
            sources.forEach((sourceName) => {
                if (map.getSource(sourceName)) {
                    map.setFeatureState(
                        {source: sourceName, id: hoveredStateId},
                        {hover: false}
                    )
                }
            })
        }
        hoveredStateId = null;
    });
}

const listenerNetten = async (map, popupNetten) => {
    const ids = ['routeMidden', 'routeHoog', 'routeHoogDashed', 'routeLow']

    map.on('mousemove', ids, function (e) {
        popupNetten
            .setLngLat(e.lngLat)
            .setHTML(
                '<p><b>ID</b>: ' + e.features[0].properties.id + '</p>' +
                '<p><b>kV</b>: ' + e.features[0].properties.kv + '</p>'
            )
            .addTo(map);
    })

    map.on('mouseleave', ids, function (e) {
        let popupEl = document.getElementsByClassName('mapboxgl-popup mapboxgl-popup-anchor-bottom')
        if (popupEl === undefined) {
            return
        }
        for (const popupElElement of popupEl) {
            popupElElement.innerHTML = ''
        }
    })
}

const listenerSegment = async (map, segmentsPoppup) => {
    map.on('mousemove', 'segments_fill', function (e) {
        segmentsPoppup
            .setLngLat(e.lngLat)
            .setHTML(
                '<p>Station: ' + e.features[0].properties.station + '</p>' +
                '<p>Netbeheerder: ' + e.features[0].properties.netbeheerder + '</p>' +
                '<p>Mean SJV: ' + e.features[0].properties.mu_sjv + '</p>'
            )
            .addTo(map);
    })

    map.on('mouseleave', ['segments_fill', 'segments_outline'], function (e) {
        let popupEl = document.getElementsByClassName('mapboxgl-popup mapboxgl-popup-anchor-bottom')
        if (popupEl === undefined) {
            return
        }
        for (const popupElElement of popupEl) {
            popupElElement.innerHTML = ''
        }
    })
}