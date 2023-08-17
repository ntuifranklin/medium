const express = require('express');
const router = express.Router();
const billRoute = require('./bill');
const bondRoute = require('./bond');
const cmbRoute = require('./cmb');
const noteRoute = require('./note');

welcome_data = {"message":"json api for treasury direct security api"} ;
module.exports = () => { 
        
    router.get('/', (request, response) => {
        response.json(welcome_data);
    }) ;

    router.use(['/bill','/bills','/Bill','Bills'], billRoute());
    router.use(['/bond','/bonds','/Bond','Bonds'], bondRoute());
    router.use(['/note','/Note','/notes','/Notes'], noteRoute());
    router.use(['/cmb','/CMB'], cmbRoute());
   
    
    return router;
};

