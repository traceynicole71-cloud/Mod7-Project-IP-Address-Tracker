//declare variables
let map;
let marker;

const Map_Box_Access_Token = 'pk.eyJ1Ijoid2FzaGluZ3RvbjI5OSIsImEiOiJja2dzaTNkMjEwNDM0MzFvZnNnNTNxNjNvIn0.c0RymMFd_Q9NADrTGZh7wg';
const Map_Box_API_Url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${Map_Box_Access_Token}`;
const API_Key = "at_pfelEwhXFECZTU734jjjXMfQnEhBw";

//initialize map
function initMap() {
    map = L.map('map').setView([0, 0], 13);

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 19,
    }).addTo(map);

    marker = L.marker([0, 0]).addTo(map);
}

//fetch IP and dmain data 
async function getIPData(input = "") {
    try {
        const isDomain = /[a-zA-Z]/.test(input) && input.includes('.');
        const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(input);

        let queryParam;
        if (isIP) {
            queryParam = `ipAddress=${input}`;
        } else if (isDomain) {
            queryParam = `domain=${input}`;
        } else {
            queryParam = `domain=${input}`;
        }
       
        const url = input === ""
        ? `https://geo.ipify.org/api/v2/country,city?apiKey=${API_Key}`
            : `https://geo.ipify.org/api/v2/country,city?apiKey=${API_Key}&${queryParam}`;

        const res = await fetch(url);
            const data = await res.json();

        if (res.ok) {
            updateUI(data);
        } else {
            alert("Location not found. Try a specific IP address or a Domain (e.g., google.com)");
        }
    } catch (error) {
        console.error("Search Error", error);
    }
}
//Map and UI update function
function updateUI(data) {
    document.getElementById("ip").textContent = data.ip;
    document.getElementById("location").textContent = `${data.location.city}, ${data.location.region}`;
    document.getElementById("timezone").textContent = `UTC ${data.location.timezone}`;
    document.getElementById("isp").textContent = data.isp;

    const { lat, lng } = data.location;

    //center map and marker
    map.setView([lat, lng], 13);
    marker.setLatLng([lat, lng]);
}

//load page and search function
document.addEventListener('DOMContentLoaded', () => {
    initMap();
   getIPData("8.8.8.8");

    const form = document.querySelector('.header_form');
    const input = document.querySelector('.header_input');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); //stops page from reloading
        const searchTerm = input.value.trim();
        if (searchTerm !== "") {
            getIPData(searchTerm);
        }
    });
});

