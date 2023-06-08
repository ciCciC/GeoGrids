const base_url = 'http://127.0.0.1:8000/'
const init = {
    "headers": {
        'Content-Type': 'application/json'
    },
}


const fetchy = async (url) => {
    const response = await fetch(url, init);
    return response.json();
}

const fetchyByCoord = async (lat, lon, end = '') => {
    return fetchy(base_url + end + '?lat=' + lat + '&lon=' + lon);
}


const fetchSegment = async (lat, lon) => {
    return fetchyByCoord(lat, lon)
}

const fetchStation = async (lat, lon) => {
    return fetchyByCoord(lat, lon, 'station')
}

const fetchSegments = async () => {
    return fetchy(base_url + "segments");
}

const fetchNets = async (station, level) => {
    return fetchy(base_url + "nets/" + level + '?station=' + station);
}

const fetchZipcodeSegment = async (station) => {
    return fetchy(base_url + "nets/zipcode_segments?station=" + station);
}

const fetchDistributionBoxes = async () => {
    return fetchy(base_url + "distributionboxes");
}

const fetchMediumVoltageInstallations = async () => {
    return fetchy(base_url + "mvoltageinstallations");
}