const map = L.map('map');
const submitBtn = document.querySelector('button[type="submit"]');

showData();

submitBtn.addEventListener('click', (event) => {
    showLoading(true);
    searchAddress();
    event.preventDefault();
})

function searchAddress() {
    const ipAddressInput = document.querySelector('#ip-address-input');
    const address = ipAddressInput.value;

    if (isAddressValid(address)) {
        showData(address);
        showError(false);
    } else {
        showLoading(false);
        showError(true);
    }
}

async function getData(address) {

    try {
        const response = await fetch(`/api/${address}`);
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error(error)
    }
}

async function showData(address) {

    const data = await getData(address);

    if (data.code === 400) {
        showError(true, 'Domain not found');
        showLoading(false);
        return;
    }

    const ipAddressSpan = document.querySelector('#ip-address');
    const locationSpan = document.querySelector('#location');
    const timezoneSpan = document.querySelector('#timezone');
    const ispSpan = document.querySelector('#isp');
    const { lat, lng, postalCode, city, timezone } = data.location;
    const postalCodeInfo = postalCode === '' ? '' : `, ${postalCode}`;

    ipAddressSpan.textContent = data.ip;
    locationSpan.textContent = city + postalCodeInfo;
    timezoneSpan.textContent = `UTC ${timezone}`;
    ispSpan.textContent = data.isp;

    showLocationOnMap(lat, lng);
    showLoading(false);
}

function showLocationOnMap(lat, lng) {
    map.setView([lat, lng], 17);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
}

function isAddressValid(address) {
    const domainPattern = /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/;
    const ipPattern = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/;

    return Boolean(
        address.match(domainPattern) ||
        address.match(ipPattern)
    );
}

function showLoading(isLoad) {
    const curtain = document.querySelector('.curtain');
    curtain.style.display = isLoad ? "flex" : "none";
}

function showError(isError, errorMessage) {
    const error = document.querySelector('.error');
    error.textContent = errorMessage || 'Invalid IP address or domain!';
    error.style.display = isError ? "block" : "none";
}