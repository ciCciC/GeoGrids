const toggleSidebar = async (properties = null) => {
    const elem = document.getElementById('right');
    const collapsed = elem.classList.toggle('collapsed');

    if (properties == null) {
        return
    }

    const sidebarContent = document.getElementsByClassName('sidebar-content')
    let stationContent = document.getElementById('stationContent')

    if (stationContent == null) {
        stationContent = document.createElement('div')
        stationContent.id = 'stationContent'
        sidebarContent[0].appendChild(stationContent)
    }

    stationContent.innerHTML = '';

    basicContent(properties)
    capacityContent(properties)
    investmentContent(properties)
    expectedCapacityContent(properties)
}

const basicContent = async (properties) => {
    const basicCols = ['station', 'netbeheerder', 'status', 'kwh', 'kw', 'mva']

    let content = document.getElementById('contentBasic')
    content.innerHTML = '';

    for (const col of basicCols) {
        const value = properties[col]
        const attribute = document.createElement('p')
        attribute.style.fontSize = 'medium';
        attribute.style.margin = '0';
        attribute.textContent = col + ' : ' + value
        content.appendChild(attribute)
    }
}

const capacityContent = async (properties) => {
    const capacityCols = ['totaleCapaciteitInvoedingMva',
        'totaleCapaciteitAfnameMva',
        'beschikbareCapaciteitInvoedingHuidigMva',
        'beschikbareCapaciteitAfnameHuidigMva']

    let content = document.getElementById('contentCapacity')
    content.innerHTML = '';

    for (const col of capacityCols) {
        const value = properties[col]
        const attribute = document.createElement('p')
        attribute.style.fontSize = 'x-small';
        attribute.style.margin = 0;
        attribute.textContent = col + ' : ' + value
        content.appendChild(attribute)
    }
}

const investmentContent = async (properties) => {
    const investmentCols = ['investeringsplanningVermogenInvoeding',
        'investeringsplanningVermogenAfname',
        'investeringsplanningTijdInvoeding',
        'investeringsplanningTijdAfname']

    let content = document.getElementById('contentInvestment')
    content.innerHTML = '';

    for (const col of investmentCols) {
        const value = properties[col]
        const attribute = document.createElement('p')
        attribute.style.fontSize = 'x-small';
        attribute.style.margin = 0;
        attribute.textContent = col + ' : ' + value
        content.appendChild(attribute)
    }
}

const expectedCapacityContent = async (properties) => {
    const afname = [
        'beschikbareCapaciteitAfnameHuidigMva',
        'beschikbareCapaciteitAfname3JaarMva',
        'beschikbareCapaciteitAfname5JaarMva',
        'beschikbareCapaciteitAfname10JaarMva'
    ]

    const invoeding = [
        'beschikbareCapaciteitInvoedingHuidigMva',
        'beschikbareCapaciteitInvoeding3JaarMva',
        'beschikbareCapaciteitInvoeding5JaarMva',
        'beschikbareCapaciteitInvoeding10JaarMva'
    ]

    const years = [0, 3, 5, 10]

    let contentInvoeding = document.getElementById('contentExpectationInvoeding')
    contentInvoeding.innerHTML = '';

    let contentAfname = document.getElementById('contentExpectationAfname')
    contentAfname.innerHTML = '';

    const resultInvoeding = invoeding.map((e, idx) => ({'Year': (2023 + years[idx]) + '-01-01', 'Mva': properties[e]}))
    const resultAfname = afname.map((e, idx) => ({'Year': (2023 + years[idx]) + '-01-01', 'Mva': properties[e]}))

    const mu1 = resultInvoeding.reduce(function (a, y, _, {length}) {
        return y['Mva'] / length
    }, 0)

    const mu2 = resultAfname.reduce(function (a, y, _, {length}) {
        return y['Mva'] / length
    }, 0)

    const plotInvoeding = Plot.plot({
        y: {
            grid: false
        },
        marks: [
            Plot.ruleY([mu1]),
            Plot.line(resultInvoeding, {x: "Year", y: "Mva", stroke: 'blue', strokeWidth: 2, text: "Invoeding"}),
            Plot.dot(resultInvoeding, {x: "Year", y: "Mva", stroke: 'black', strokeWidth: 3}),
            Plot.linearRegressionY(resultInvoeding, {x: "Year", y: "Mva", stroke: "orange", ci: 0.95})
        ]
    })

    const plotAfname = Plot.plot({
        y: {
            grid: false
        },
        marks: [
            Plot.ruleY([mu2]),
            Plot.line(resultAfname, {x: "Year", y: "Mva", stroke: 'blue', strokeWidth: 2, text: "Afname"}),
            Plot.dot(resultAfname, {x: "Year", y: "Mva", stroke: 'black', strokeWidth: 3}),
            Plot.linearRegressionY(resultAfname, {x: "Year", y: "Mva", stroke: "orange", ci: 0.95})
        ]
    })

    contentInvoeding.style.padding = 0;
    contentAfname.style.padding = 0;
    contentInvoeding.append(plotInvoeding)
    contentAfname.append(plotAfname)
}