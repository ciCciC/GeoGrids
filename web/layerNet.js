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

    // map.addSource('laagpanningskabels', {
    //     'type': 'geojson',
    //     'data': 'http://127.0.0.1:8000/static/laagpanningskabels.geojson'
    // });

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

    const dashArraySequence = [
        [0, 4, 3],
        [0.5, 4, 2.5],
        [1, 4, 2],
        [1.5, 4, 1.5],
        [2, 4, 1],
        [2.5, 4, 0.5],
        [3, 4, 0],
        [0, 0.5, 3, 3.5],
        [0, 1, 3, 3],
        [0, 1.5, 3, 2.5],
        [0, 2, 3, 2],
        [0, 2.5, 3, 1.5],
        [0, 3, 3, 1],
        [0, 3.5, 3, 0.5]
    ];

    let step = 0;

    function animateDashArray(timestamp) {
        const newStep = parseInt(
            (timestamp / 60) % dashArraySequence.length
        );

        if (newStep !== step) {
            map.setPaintProperty(
                'routeHoogDashed',
                'line-dasharray',
                dashArraySequence[step]
            );
            step = newStep;
        }

        requestAnimationFrame(animateDashArray);
    }

    animateDashArray(0);

    // map.addLayer({
    //     'id': 'routeLaag',
    //     'type': 'line',
    //     'source': 'laagpanningskabels',
    //     'layout': {
    //         'line-join': 'round',
    //         'line-cap': 'round'
    //     },
    //     'paint': {
    //         'line-color': '#ff0000',
    //         'line-width': 3,
    //     }
    // });

    await listenerFocusNet(map, hoveredStateId)
    await listenerNetten(map, popupNetten)
}