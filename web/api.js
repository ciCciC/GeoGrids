const base_url = 'http://127.0.0.1:5001/'
const init = {
    "headers": {
        'Content-Type': 'application/json'
    },
}


const fetchy = async (url) => {
    const response = await fetch(url, init);
    return response.json();
}

const fetchyByCoord = async (lat, lon, router = '') => {
    return fetchy(base_url + router + '/' + lat + ',' + lon);
}


const fetchSegment = async (lat, lon) => {
    return fetchyByCoord(lat, lon, 'segments')
}

const fetchSegments = async () => {
    return fetchy(base_url + "segments");
}

const fetchStation = async (lat, lon) => {
    return fetchyByCoord(lat, lon, 'stations')
}

const fetchNets = async (station) => {
    return fetchy(base_url + "nets/" + station);
}

const fetchZipcodeSegment = async (station) => {
    return fetchy(base_url + "nets/zipcode_segments/" + station);
}