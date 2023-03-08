const toggleSidebar = async (properties) => {
    const elem = document.getElementById('right');
    const collapsed = elem.classList.toggle('collapsed');

    const sidebarContent = document.getElementsByClassName('sidebar-content')
    let stationContent = document.getElementById('stationContent')

    if (stationContent == null) {
        stationContent = document.createElement('div')
        stationContent.id = 'stationContent'
        sidebarContent[0].appendChild(stationContent)
    }

    stationContent.innerHTML = '';

    Object.entries(properties).forEach((entry) => {
        const attribute = document.createElement('p')
        attribute.style.fontSize = 'x-small';
        attribute.style.margin = 0;
        attribute.textContent = entry[0] + ' : ' + entry[1]
        stationContent.appendChild(attribute)
    })
}