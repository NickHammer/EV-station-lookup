navigator.geolocation.getCurrentPosition(success, error);

let map;

function success(position) {
    const { latitude, longitude } = position.coords;

    map = L.map('map').setView([latitude, longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);

    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    L.marker([latitude, longitude], { icon: greenIcon }).addTo(map)
        .bindPopup("You are here")
        .openPopup();

    fetchStations(latitude, longitude, map);
}

function error(err) {
    alert("Geolocation error: " + err.message);
}

function safeLabel(value, fallback = '—') {
    return value || fallback;
}

function fetchStations(lat, lon, map) {
    const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lon}&distance=10&maxresults=50&compact=false&verbose=true`;

    fetch(url, {
        headers: {
            'X-API-Key': 'a847e38e-9e96-4638-a159-db95ad1b90ee'
        }
    })
    .then(res => res.json())
    .then(data => {
        const selectedConnector = document.getElementById('vehicleSelect').value;

        data.forEach(station => {
        const connections = station.Connections || [];
        const connectorTitles = connections.map(conn => conn.ConnectionType?.Title).filter(Boolean);

        if (selectedConnector && !connectorTitles.includes(selectedConnector)) return;

        const coords = [station.AddressInfo.Latitude, station.AddressInfo.Longitude];
        const popup = `
            <strong>${safeLabel(station.AddressInfo.Title)}</strong><br>
            ${safeLabel(station.AddressInfo.AddressLine1)}<br>
            ${safeLabel(station.AddressInfo.Town)}, ${safeLabel(station.AddressInfo.StateOrProvince)}<br>
            <strong>Operator:</strong> ${safeLabel(station.OperatorInfo?.Title)}<br>
            <strong>Usage:</strong> ${safeLabel(station.UsageType?.Title)}<br>
            <strong>Cost:</strong> ${safeLabel(station.UsageCost)}<br>
            <strong>Connectors:</strong>
            <ul style="margin-left:1em">
            ${connections.map(conn => `<li>${safeLabel(conn.ConnectionType?.Title)} – ${safeLabel(conn.Level?.Title)} (${conn.PowerKW ?? '?'}kW)</li>`).join('')}
            </ul>
            <em>Last Updated: ${station.DateLastStatusUpdate?.split('T')[0] || '—'}</em>
        `;
        L.marker(coords).addTo(map).bindPopup(popup);
        });
    });
}

document.getElementById('vehicleSelect').addEventListener('change', () => {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker && !layer._icon.classList.contains('leaflet-marker-draggable')) {
            map.removeLayer(layer);
        }
    });
    fetchStations(map.getCenter().lat, map.getCenter().lng, map);
});
