const express = require('express');


const { faker } = require('@faker-js/faker');
const path = require('path');

const cookieSession = require('cookie-session');

const routes = require('./routes');
const { response } = require('express');

const app = express();
const PORT = 8089;
app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'session',
    keys: [faker.internet.password(100),faker.internet.password(100)],
}))


app.use((request, response, next) => { 
	response.setHeader('Content-Type', 'application/json');
    return next();
});

app.use('/',routes());

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});