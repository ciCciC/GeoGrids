const fetchy = async (lat, lon, end='') => {
    let url = "http://127.0.0.1:8000/"
    url += end + '?lat=' + lat + '&lon=' + lon
    const response = await fetch(url, {
        "headers": {
            'Content-Type': 'application/json'
        },
    });

    return response.json();
}


const fetchSegment = async (lat, lon) => {
    return fetchy(lat, lon)
}

const fetchStation  = async (lat, lon) => {
    return fetchy(lat, lon, 'station')
}

const fetchSegments = async () => {
    let url = "http://127.0.0.1:8000/segments"
    const response = await fetch(url, {
        "headers": {
            'Content-Type': 'application/json'
        },
    });

    return response.json();
}