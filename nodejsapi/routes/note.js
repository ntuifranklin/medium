const express = require('express');
const router = express.Router();

const { retrieveSecurity } = require('./security');


module.exports = () => { 
    
	router.get('/', (request, response, next) => {
		
		response.setHeader('Content-Type', 'application/json');
		retrieveSecurity(securityType='Note')
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

