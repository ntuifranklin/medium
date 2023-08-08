/* transaction.js */
const { createDatabase,
    newBankAccountForNewCustomer,
    getAllDataFromTable
 } = require('./utilities');

 
createDatabase()
.then(successMessage => {
    console.log(successMessage);

    /* Repeat the below 3 times */
    var i = 0 ;
    for ( i=0 ; i < 3; i++) {
        var openAccountForNewCustomer_Promise1 = newBankAccountForNewCustomer();
        openAccountForNewCustomer_Promise1.
        then(successMessage => {

            console.log(`Round ${i+1} : account and customer creation successful ${successMessage}`);
            getAllDataFromTable(tableName="CUSTOMER").
            then(customers => console.log(`List of checking customers : ${JSON.stringify(customers)}`))
            .catch(e1 => console.log(e1));;
            
            getAllDataFromTable(tableName="USER").
            then(users => console.log(`List of users : ${JSON.stringify(users)}`))
            .catch(e2 => console.log(e2));

            getAllDataFromTable(tableName="CHECKINGACCOUNT").
            then(accounts => console.log(`List of checking accounts : ${JSON.stringify(accounts)}`))
            .catch(e3 => console.log(e3));
        }).
        catch(e => {
            
            console.log(`Round ${i+1} : account and customer creation failed. Status of database: ${e}`);
            getAllDataFromTable(tableName="CUSTOMER").
            then(customers => console.log(`List of checking customers : ${JSON.stringify(customers)}`))
            .catch(e1 => console.log(e1));;
            
            getAllDataFromTable(tableName="USER").
            then(users => console.log(`List of users : ${JSON.stringify(users)}`))
            .catch(e2 => console.log(e2));

            getAllDataFromTable(tableName="CHECKINGACCOUNT").
            then(accounts => console.log(`List of checking accounts : ${JSON.stringify(accounts)}`))
            .catch(e3 => console.log(e3));
        }); 

    }
    
    
})
.catch(error => console.log(error));
console.log("\n");