const layerNet = async (map, popupNetten, hoveredStateId) => {

    map.addSource('reconstructedlines', {
        'type': 'geojson',
        'data': base_url + 'static/reconstructed_lines_msi_lsv.geojson',
        'generateId': true
    });

    map.addSource('middenspanningskabels', {
        'type': 'geojson',
        'data': base_url + 'static/middenspanningskabels.geojson',
        'generateId': true
    });

    map.addSource('hoogspanningskabels', {
        'type': 'geojson',
        'data': base_url + 'static/hoogspanningskabels.geojson',
        'generateId': true
    });

    map.addLayer({
        'id': 'routeReconstructedLines',
        'type': 'line',
        'source': 'reconstructedlines',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                '#ff0000',
                '#00c4ff'
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
    })

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
    await listenerPopupNetten(map, popupNetten)

    map.setLayoutProperty('routeReconstructedLines', 'visibility', 'none');
    map.setLayoutProperty('routeMidden', 'visibility', 'none');
    map.setLayoutProperty('routeHoog', 'visibility', 'none');
    map.setLayoutProperty('routeHoogDashed', 'visibility', 'none');
}

const distributionBoxes = async (map) => {
    fetchDistributionBoxes()
        .then((data) => {

            if (map.getSource('distribution_box')) {
                map.getSource('distribution_box').setData(data);
            } else {

                map.addSource('distribution_box', {
                    'type': 'geojson',
                    'data': data,
                    'generateId': true
                });

                map.addLayer({
                    'id': 'distributionBoxFill',
                    'type': 'circle',
                    'source': 'distribution_box',
                    'layout': {},
                    'paint': {
                        'circle-color': 'rgba(255,0,0,0)',
                        'circle-stroke-color': 'rgb(14,218,0)',
                        'circle-stroke-width': 2,
                        'circle-stroke-opacity': .5
                    }
                });
            }
            map.setLayoutProperty('distributionBoxFill', 'visibility', 'none');
        })
}


const mediumVoltageInstallations = async (map) => {
    fetchMediumVoltageInstallations()
        .then((data) => {

            if (map.getSource('m_voltage_installs')) {
                map.getSource('m_voltage_installs').setData(data);
            } else {

                map.addSource('m_voltage_installs', {
                    'type': 'geojson',
                    'data': data,
                    'generateId': true
                });

                map.addLayer({
                    'id': 'mVoltageInstallsFill',
                    'type': 'circle',
                    'source': 'm_voltage_installs',
                    'layout': {},
                    'paint': {
                        'circle-color': 'rgb(255,145,0)',
                        'circle-stroke-color': 'rgb(0,0,0)',
                        'circle-stroke-width': 2,
                        'circle-stroke-opacity': .5
                    }
                });
            }
            map.setLayoutProperty('mVoltageInstallsFill', 'visibility', 'none');
        })
}