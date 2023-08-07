/*
docker run --detach --name dbtransactions -it 
--env MARIADB_USER=exampleuser 
--env MARIADB_PASSWORD=gr33nh@t 
--env MARIADB_ROOT_PASSWORD=b1@ckh@t  
mariadb:latest
*/

const fileReader = require('fs');
const mariadb = require('mariadb');
const { faker } = require('@faker-js/faker');

const pool = mariadb.createPool({
     host: '127.0.0.1', 
     user:'root', 
     password: 'b1@ckh@t',
     connectionLimit: 20
});

function getDatabaseCreationQueryAsSQLText() {
    return new Promise((resolve, reject) => {
        var sqlQueryFile = './createDatabase.sql';
        fileReader.readFile(sqlQueryFile, 'utf8', (err,data) => {
            if (err) 
                reject(err);
            resolve(data);
        });
    });
};
exports.getDatabaseCreationQueryAsSQLText = getDatabaseCreationQueryAsSQLText

function createDatabase() {
    return new Promise((resolve, reject) => {
        /* Get creation of database */
        var sqlQueryTextPromise = getDatabaseCreationQueryAsSQLText();

        /* */
        sqlQueryTextPromise
        .then((sqlQuery) => {
                        
            const pool = mariadb.createPool({
                host: '127.0.0.1', 
                user:'root', 
                password: 'b1@ckh@t',
                connectionLimit: 20
            });
            dbConnectionPromise = pool.getConnection();
            dbConnectionPromise
            .then( mariaDbConn => {

            
                /* We need all queries obtained from the sql file seperately */
                var queries = sqlQuery.toString().split(';');

                /* We are running everyting as a transaction */
                mariaDbConn.beginTransaction()
                .then(resultBeginTransaction => console.log(`\nSuccess beginning transaction : ${resultBeginTransaction}`))
                .catch(errorBeginingTransaction => {
                    pool.end();
                    reject(`Error beginning transaction  : ${errorBeginingTransaction}`);
                });

                console.log(`List of queries : ${queries}`);
                /* Run each query individually */
                queries.forEach(eachQuery => {
                    if (eachQuery.length != 0) {
                        console.log(`Running query ${eachQuery}`);
                        mariaDbConn.query(eachQuery)
                        .then(resultRuningThisQuery =>
                            console.log(`#####\nSuccess running '${eachQuery}' : ${resultRuningThisQuery} \n#####\n`)
                        )
                        .catch(errorRunningThisQuery => {
                            console.log(`Error running '${eachQuery}' : ${errorRunningThisQuery}`);
                                mariaDbConn.rollback();
                                reject(errorRunningThisQuery);
                        });

                    }
                }) ;

                /* At the end of the enitre transaction, commit this as an atomic whole change */
                mariaDbConn.commit()
                .then(resultEndingTransaction => {
                    console.log(resultEndingTransaction);
                    pool.end();
                    resolve("Successful creation of database");
                })
                .catch(errorEndingTransaction => {
                    pool.end();
                    reject(errorEndingTransaction);
                });                
                
            })
            .catch(errorReadingSqlFile => {
                console.log(errorReadingSqlFile);
                
            })

        })
        .catch(errorOpeningSqlfile => console.log(`${errorOpeningSqlfile}`))
    });
}

exports.createDatabase = createDatabase
function generateRandomUser() {
    return {
        USERID: faker.string.uuid(),
        EMAIL: faker.internet.email(),
        USERNAME: faker.internet.userName(),
        PASSW: faker.internet.password(),
      };
};
exports.generateRandomUser = generateRandomUser ;

function generateRandomCustomer() {
    
    return {
        CUSTOMERID: faker.string.uuid(),
        FIRSTNAME: faker.person.firstName(),
        MIDDLENAME: faker.person.middleName(),
        LASTNAME: faker.person.lastName(),
        DOB: faker.date.birthdate(),
        SSN: faker.number.int({max:999999999, min:100000001}),
        PHONENUMBER: faker.phone.number('###-###-####')
      };
};
exports.generateRandomCustomer  = generateRandomCustomer ;

function generateNewAccount(){
    return {
        ACCOUNTID: faker.string.uuid(),
        ACCOUNTNO: faker.finance.accountNumber({length:20}),
        CUSTOMERID: faker.string.uuid(),
        BALANCE: faker.number.float({min:99.99, max:9999.99}),
    }
};
exports.generateNewAccount = generateNewAccount;

function newBankAccountForNewCustomer() {

    return new Promise((resolve, reject) => {
        
                
        const pool = mariadb.createPool({
            host: '127.0.0.1', 
            user:'root', 
            password: 'b1@ckh@t',
            connectionLimit: 20
        });
        
        /* Insert customer and user as a transaction */
        dbConnectionPromise = pool.getConnection();
        dbConnectionPromise
        .then(dbConn => {
            /* start transactin */
            dbConn.beginTransaction().
            catch(e11 => {
                console.log(e11);
                dbConn.rollback();
                reject(e11);
            })

            /* Select the database being used */
            dbConn.query("USE `ONLINEBANKING`").
            catch(e111 => {
                console.log(e111);
                dbConn.rollback();
                reject(e111);
            });

            /* Insert new Customer First */
            var customerObject = generateRandomCustomer();
            dbConn.query("INSERT INTO CUSTOMER VALUES(?,?,?,?,?,?,?)",[
                customerObject["CUSTOMERID"],
                customerObject["FIRSTNAME"],
                customerObject["MIDDLENAME"],
                customerObject["LASTNAME"],
                customerObject["DOB"],
                customerObject["SSN"],
                customerObject["PHONENUMBER"]
            ]).
            catch(e12 => {
                console.log(e12);
                dbConn.rollback();
                reject(e12);
            });

            /* Then insert a new user */
            var userObject = generateRandomUser();
            dbConn.query("INSERT INTO USER VALUES(?,?,?,?)", [
                userObject["USERID"],
                userObject["EMAIL"],
                userObject["USERNAME"],
                userObject["PASSW"]
            ]).
            catch(e13 => {
                console.log(e13);
                dbConn.rollback();
                reject(e13);
            })

            /* Insert a new account number for customer */
            var account = generateNewAccount();
            account["CUSTOMERID"] = customerObject["CUSTOMERID"];

            dbConn.query("INSERT INTO CHECKINGACCOUNT VALUES(?,?,?,?)", [
                account["ACCOUNTID"],
                account["ACCOUNTNO"],
                account["CUSTOMERID"],
                account["BALANCE"]
            ]);

            /* Finally End transaction */
            dbConn.commit().
            catch(e14 => {
                console.log(e14);
                dbConn.rollback();
                reject(e14);
            });

            resolve("Successful Opening of a Bank Account");
            
        })
        .catch(e0 => {
            console.log(e0);
            reject(e0);
        })


    });
} ;
exports.newBankAccountForNewCustomer = newBankAccountForNewCustomer



