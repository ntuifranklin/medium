/*
docker run --detach --name dbtransactions -it 
--env MARIADB_USER=exampleuser 
--env MARIADB_PASSWORD=gr33nh@t 
--env MARIADB_ROOT_PASSWORD=b1@ckh@t  
mariadb:latest
*/

require('dotenv').config();

const fileReader = require('fs');
const mariadb = require('mariadb');
const { faker } = require('@faker-js/faker');
const { getPriority } = require('os');



function getMariaDbPool(){
    return mariadb.createPool({
        host: 'localhost', 
        user:'root', 
        password: process.env.MARIADB_ROOT_PASSWORD,
        connectionLimit: 20
   });

};
exports.getMariaDbPool = getMariaDbPool;

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
                        
            const pool = getMariaDbPool();
            dbConnectionPromise = pool.getConnection();
            dbConnectionPromise
            .then( mariaDbConn => {

            
                /* We need all queries obtained from the sql file seperately */
                var queries = sqlQuery.toString().split(';');

                /* We are running everyting as a transaction */
                mariaDbConn.beginTransaction()
                .then(resultBeginTransaction => console.log(`\nSuccess beginning transaction : ${JSON.stringify(resultBeginTransaction.toString())}`))
                .catch(errorBeginingTransaction => {
                    reject(`Error beginning transaction  : ${errorBeginingTransaction}`);
                });

                
                /* Run each query individually */
                queries.forEach(eachQuery => {
                    if (eachQuery.length != 0) {
                        console.log(`Running query ${eachQuery}`);
                        mariaDbConn.query(eachQuery)
                        .then(resultRuningThisQuery =>
                            console.log(`#####\nSuccess running '${eachQuery}' : ${JSON.stringify(resultRuningThisQuery.toString())} \n#####\n`)
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
                    console.log(`Success commiting transaction : ${JSON.stringify(resultEndingTransaction.toString())}`);
                    resolve("Successful creation of database");
                })
                .catch(errorEndingTransaction => {
                    mariaDbConn.rollback();
                    reject(errorEndingTransaction);
                }); 
                
                      
            })
            .catch(errorReadingSqlFile => {
                console.log(errorReadingSqlFile);
                
            });
                    
        
        })
        .catch(errorOpeningSqlfile => console.log(`${errorOpeningSqlfile}`))
    });
} ;

exports.createDatabase = createDatabase
function generateRandomUser() {
    return {
        USERID: faker.string.uuid(),
        EMAIL: faker.internet.email(),
        USERNAME: faker.internet.userName(),
        PASSW: faker.internet.password(),
        CUSTOMERID: faker.string.uuid()
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
        
        const pool = getMariaDbPool();
        
        /* Insert customer and user as a transaction */
        dbConnectionPromise = pool.getConnection();
        dbConnectionPromise
        .then(dbConn => {
            /* start transaction */
            dbConn.beginTransaction().
            then(r => console.log(`${r.toString()}`)).
            catch(e11 => {
                console.log(e11);
                reject(e11);
            })

            /* Select the database being used */
            dbConn.query("USE `ONLINEBANKING`").
            then(r => console.log(`${r.toString()}`)).
            catch(e111 => {
                console.log(e111);
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
            then(r => console.log(`${r.toString()}`)).
            catch(e12 => {
                console.log(e12);
                dbConn.rollback();
                reject(e12);
            });

            /* Then insert a new user for this customer */
            var userObject = generateRandomUser();
            userObject["CUSTOMERID"] = customerObject["CUSTOMERID"];
            dbConn.query("INSERT INTO USER VALUES(?,?,?,?,?)", [
                userObject["USERID"],
                userObject["EMAIL"],
                userObject["USERNAME"],
                userObject["PASSW"],
                userObject["CUSTOMERID"]
            ]).
            then(r => console.log(`${r.toString()}`)).
            catch(e13 => {
                console.log(e13);
                dbConn.rollback();
                reject(e13);
            })

            /* Insert a new account number for this customer */
            var account = generateNewAccount();
            account["CUSTOMERID"] = customerObject["CUSTOMERID"];

            dbConn.query("INSERT INTO CHECKINGACCOUNT VALUES(?,?,?,?)", [
                account["ACCOUNTID"],
                account["ACCOUNTNO"],
                account["CUSTOMERID"],
                account["BALANCE"]
            ]).
            then(r => console.log(`${r.toString()}`)).
            catch(e131 => {
                console.log(e131);
                dbConn.rollback();
                reject(e131);
            });

            /* Insert some random rejection */
            if (faker.number.int({min:1, max:10}) % 2 == 0 ){
                dbConn.rollback();
                reject("We only accept odd generated random numbers");
            }
            /* Finally End transaction */
            dbConn.commit().
            then((resCommit) => {
                console.log(`${resCommit.toString()}`);
                resolve("Successful Opening of a Bank Account");
            }).
            catch(e14 => {
                console.log(e14);
                dbConn.rollback();
                reject(e14);
            }); 
        })
        .catch(e0 => {
            console.log(e0);
            reject(e0);
        });

    });
} ;
exports.newBankAccountForNewCustomer = newBankAccountForNewCustomer ;

function getAllDataFromTable(tableName="USER"){
    return new Promise((resolve, reject) => {
        const pool = getMariaDbPool();
        dbConnectionPromise = pool.getConnection();
        dbConnectionPromise
        .then(dbConn => {
            dbConn.query("USE `ONLINEBANKING`"). 
            then(r => {
                dbConn.query(`SELECT * FROM ${tableName}`).
                then(rows => resolve(rows)).
                catch(error => reject(error)) ;
            }). 
            catch(err => reject(err));
          
        }).
        catch(e => reject(e));
    });
};
exports.getAllDataFromTable = getAllDataFromTable;



