

//---------------- DEFAULT

// var map = L.map('map').setView([36.802975, 10.178224], 5);
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
// L.marker([36.802975, 10.178224]).addTo(map).bindPopup('IPSET - Tunis').openPopup();

//-----------------


var map = L.map('map').setView([36.8029712, 10.1804132], 17); // Updated coordinates from Google Maps
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define a custom marker icon with blue color (#0a3194)
var blueIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Anchor point of the icon
    popupAnchor: [1, -34], // Popup position
    shadowSize: [41, 41] // Shadow size
});

// Add marker with blue icon
L.marker([36.8029712, 10.1804132], { icon: blueIcon }) // Updated marker coordinates
    .addTo(map)
    .bindPopup('IPSET - 04, Rue des Entrepreneurs, Tunis')
    .openPopup();