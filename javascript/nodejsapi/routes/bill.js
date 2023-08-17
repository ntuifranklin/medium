const express = require('express');
const router = express.Router();

const { retrieveSecurity } = require('./security');

const data = [{"securityType":"Bill"}] ;

module.exports = () => { 
    
	router.get('/', (request, response, next) => {
		
		response.setHeader('Content-Type', 'application/json');
		retrieveSecurity(securityType='Bill')
		.then( (body) => {
				response.json(body);
				console.log(body);
		 })
		.catch((error) => {
			response.json({"error":error})
			console.log(error) ;
		});
		
	})

    return router;
};

