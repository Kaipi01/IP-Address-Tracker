require('dotenv').config();
const express = require("express");
const fetch = require('node-fetch');
const port = process.env.PORT || 8888;
const app = express();

app.use(express.static('public'));

app.set('trust proxy', true)

app.listen(port, () => {
    console.log(`Starting server at port: ${port}`);
})

app.get('/api/:address', async (request, response) => {
    const apiKey = process.env.APIKEY;
    const address = request.params.address;
    const userAddress = process.env.ISSERVER
        ? `&domain=${request.ip}`
        : '';
    const param = address !== 'undefined'
        ? `&domain=${address}`
        : userAddress;
    const apiURL = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}${param}`
    const fetchApi = await fetch(apiURL);
    const data = await fetchApi.json();
    response.json(data);
})