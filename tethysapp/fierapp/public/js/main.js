/*
copyright Riley Hales, RCH Engineering, 2021
All rights reserved
 */
const MapApp = (function () {
    "use strict"

    // Basemaps
    const URL_OPENSTREETMAP = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    const ATTRIBUTION_OPEN_STREET_MAP = {attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
    const basemaps = {
        "Open Street Maps": L.tileLayer(URL_OPENSTREETMAP, ATTRIBUTION_OPEN_STREET_MAP),
        "ESRI World Imagery": L.esri.basemapLayer('Imagery'),
        "ESRI Labeled World Imagery": L.layerGroup([L.esri.basemapLayer('Imagery'), L.esri.basemapLayer('ImageryLabels')]),
        "ESRI Terrain": L.esri.basemapLayer('Terrain'),
        "ESRI Labeled Terrain": L.layerGroup([L.esri.basemapLayer('Terrain'), L.esri.basemapLayer('ImageryLabels')]),
    }
    // URLs and Paths
    const DIV_MAP = "map"
    // Config JSONS
    const TIME_LAYER_CONFIGS = {
        name: 'time',
        requestTimefromCapabilities: true,
        updateTimeDimension: true,
        updateTimeDimensionMode: 'replace',
        cache: 20,
    }
    const MAP_INIT_CONFIGS = {
        zoom: 4,
        minZoom: 2,
        zoomSnap: .5,
        boxZoom: true,
        maxBounds: L.latLngBounds(L.latLng(-100.0, -270.0), L.latLng(100.0, 270.0)),
        center: [0, 0],
        timeDimension: true,
        timeDimensionControl: true,
        timeDimensionControlOptions: {
            position: "bottomleft",
            autoPlay: true,
            loopButton: true,
            backwardButton: true,
            forwardButton: true,
            timeSliderDragUpdate: true,
            minSpeed: 2,
            maxSpeed: 6,
            speedStep: 1,
        },
    }
    // WMS Buttons and Inputs
    const INPUT_WMS_OPAC = document.getElementById("wms-layer-opacity")

    let LAYER_WMS = null
    let layerControl
    let map

    let legendURL
    const legend = L.control({position: 'bottomright'})
    legend.onAdd = () => {
        let div = L.DomUtil.create('div')
        div.innerHTML = `<img src="${legendURL}" alt="legend" style="width:100% float:right">`
        return div
    }
    const latLonPopUp = L.control({position: 'bottomleft'})
    let latLonDivElement
    latLonPopUp.onAdd = () => {
        return L.DomUtil.create('div', 'mouse-position')
    }

    const init = function () {
        map = L.map(DIV_MAP, MAP_INIT_CONFIGS)
        basemaps[Object.keys(basemaps)[0]].addTo(map)

        layerControl = L.control.layers(basemaps, {}, {collapsed: false})
        layerControl.addTo(map)

        latLonPopUp.addTo(map)
        latLonDivElement = document.getElementsByClassName("mouse-position")[0]
        map.on("mousemove", event => {
            latLonDivElement.innerHTML = `Lat: ${event.latlng.lat.toFixed(5)}, Lon: ${event.latlng.lng.toFixed(5)}`
        })
        document.getElementById("wms-layer-opacity").addEventListener("change", () => {if (LAYER_WMS) LAYER_WMS.setOpacity(document.getElementById("wms-layer-opacity").value)})
    }

    const addWMS = function (url, layer, title, time) {
        if (LAYER_WMS !== null) {
            layerControl.removeLayer(LAYER_WMS)
            map.removeLayer(LAYER_WMS)
        }
        const wmsOptions = {
            version: "1.3.0",
            layers: layer,
            format: "image/png",
            transparent: true,
            crossOrigin: false,
            useCache: true,
            opacity: `${INPUT_WMS_OPAC.value}`,
            colorscalerange: layer === 'proba' ? '0,100' : '0,1',
            styles: 'boxfill/bluescale',
        }
        legendURL = `${url}?REQUEST=GetLegendGraphic&LAYER=${layer}&PALETTE=bluescale&COLORSCALERANGE=${layer === 'proba' ? '0,100' : '0,1'}`
        if (time) LAYER_WMS = L.timeDimension.layer.wms(L.tileLayer.wms(url, wmsOptions), TIME_LAYER_CONFIGS).addTo(map)
        else LAYER_WMS = L.tileLayer.wms(url, wmsOptions).addTo(map)
        layerControl.addOverlay(LAYER_WMS, (title ? title : layer))
        legend.addTo(map)
    }

    return {
        init,
        addWMS,
    }

}())
MapApp.init()