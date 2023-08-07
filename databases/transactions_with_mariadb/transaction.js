/*
docker run --detach --name dbtransactions -it 
--env MARIADB_USER=exampleuser 
--env MARIADB_PASSWORD=gr33nh@t 
--env MARIADB_ROOT_PASSWORD=b1@ckh@t  
mariadb:latest
*/

const fileReader = require('fs');
const mariadb = require('mariadb');
const { createDatabase,
    getDatabaseCreationQueryAsSQLText,
    generateRandomCustomer,
    newBankAccountForNewCustomer,
    generateRandomUser
 } = require('./utilities');

 
createDatabase()
.then(successMessage => {
    console.log(successMessage);
    var openAccountForNewCustomer_Promise = newBankAccountForNewCustomer();
    openAccountForNewCustomer_Promise.
    then(successMessage => console.log(successMessage)).
    catch(e => console.log(e));
    
})
.catch(error => console.log(error));
console.log("\n");

