const express = require('express');
const routes = require('./routes');
const dotenv = require('dotenv');

dotenv.config();


const app = express();


//middleware
app.use(express.json());
app.use(routes);

app.listen(9000, () => console.log('Listening on port 9000.'));