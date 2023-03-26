require('dotenv').config();

const express = require("express");
const fetch = require('node-fetch');
const port = process.env.PORT || 8888;
const app = express();

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Starting server at port: ${port}`);
})