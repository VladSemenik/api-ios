const express = require('express');
const routes = require('./routes');
const dotenv = require('dotenv');
const helmet = require('helmet');
const bodyParser = require('body-parser');
// const https = require('https');
// const fs = require('fs');

dotenv.config();


const app = express();


//middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
//
// app.listen(+process.env.HTTPS_PORT + 1, '10.22.0.57', () => console.log(`Listening 10.22.0.57 on port ${+process.env.HTTPS_PORT + 1}.`));
app.listen(+process.env.HTTPS_PORT, '127.0.0.1', () => console.log(`Listening 127.0.0.1 on port ${process.env.HTTPS_PORT}.`));




// const key =  fs.readFileSync('server.key');
// const cert = fs.readFileSync('server.crt');
// https.createServer({key, cert}, app)
//   .listen(process.env.HTTPS_PORT, '0.0.0.0', () => {
//     console.log(`Server listen port ${process.env.HTTPS_PORT}`)
//   });