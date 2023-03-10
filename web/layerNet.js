const layerNet = async (map, popupNetten, hoveredStateId) => {

    map.addSource('middenspanningskabels', {
        'type': 'geojson',
        'data': 'http://127.0.0.1:8000/static/middenspanningskabels.geojson',
        'generateId': true
    });

    map.addSource('hoogspanningskabels', {
        'type': 'geojson',
        'data': 'http://127.0.0.1:8000/static/hoogspanningskabels.geojson',
        'generateId': true
    });

    map.addLayer({
        'id': 'routeMidden',
        'type': 'line',
        'source': 'middenspanningskabels',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                '#ff0000',
                '#0066ff'
            ],
            'line-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.5
            ],
            'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                4,
                2
            ],
        }
    });

    map.addLayer({
        'id': 'routeHoog',
        'type': 'line',
        'source': 'hoogspanningskabels',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round',
        },
        'paint': {
            'line-color': '#000000',
            'line-width': 6,
            'line-opacity': 0.4
        }
    });

    map.addLayer({
        'id': 'routeHoogDashed',
        'type': 'line',
        'source': 'hoogspanningskabels',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round',
        },
        'paint': {
            'line-color': 'rgb(255,251,0)',
            'line-width': 3,
            'line-dasharray': [0, 4, 3]
        }
    });

    await animateDash('routeHoogDashed')
    await listenerFocusNet(map, hoveredStateId)
    await listenerNetten(map, popupNetten)
}