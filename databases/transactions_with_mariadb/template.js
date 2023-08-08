const sqlite3 = require('sqlite3').verbose();
const fileReader = require('fs');
const { resolve } = require('path');
const DBNAME = 'ctdrates_database.db';
const db = new sqlite3.Database(DBNAME);

/*
docker run --detach --name dbtransactions -it 
--env MARIADB_USER=exampleuser 
--env MARIADB_PASSWORD=gr33nh@t 
--env MARIADB_ROOT_PASSWORD=b1@ckh@t  
mariadb:latest
*/
/* Shipline */
const SHIPLINE_TABLE_NAME = 'SHIPLINE';
const SHIPLINE_ID = 'SHIPLINEID';
const SHIPLINE_PORTID = 'PORTID';

/* Port of Departure/Arrival */
const PORT = 'PORT';

/* City table */
const CITY_TABLE_NAME = 'CITIES';
const CITY_TABLE_ID_NAME = 'ID';

/* State table */
const STATE_TABLE_NAME = 'STATES';
const STATE_TABLE_ID_NAME = 'ID';

/* Country table */
const COUNTRY_TABLE_NAME = 'COUNTRIES';
const COUNTRY_TABLE_ID_NAME = 'ID';

/* Rate table */
const RATE_TABLE_NAME = 'RATE';

/* Rate Items */
const RATE_ITEMS_TABLE_NAME = 'RATE_ITMES';

class DataRepository{
    constructor() {
        this.dbConnection = null ;
    }
    static getDbConnector() {
        if ( this.dbConnection == null )
            this.dbConnection = new sqlite3.Database(DBNAME);

        return this.dbConnection ;
    }
    static createTables() {
        /* creation of cities, states, then country */
        return new Promise((resolve, reject) => {
            DataRepository.getDropAndCreateTableWorldCitiesQuery()
            .then(dropAndCreateCitiesSqlQuery => {
               
                let db = DataRepository.getDbConnector();
                const dropAndCreateSqlArray = dropAndCreateCitiesSqlQuery.toString().split(';');
                
                db.serialize(() => {
                    /* BEGIN TRANSACTION  */
                    db.run('BEGIN TRANSACTION', (errt) => {
                        if (errt)
                            reject(errt);

                    });
                    dropAndCreateSqlArray.forEach(query => {
                        if(query) {
                            //console.log(`running query ${query}`);
                            db.run(query, (err) => {
                                if (err) reject(`Error running ${query} : ${err}`);                                   
                            });
                        }
                    });
                    db.run('END TRANSACTION', (erret) => {
                        if (erret)
                            reject(erret);
                            resolve(true);

                    });
                    
                });
                
            })
            .catch(err1 => reject(`Error in creating table : ${err1}`))
            
        });
    }

    static selectCities(cityId = null ) {
        this.dbConnection = DataRepository.getDbConnector();
        return new Promise((resolve,reject) => {
            
        
        if (cityId != null ) {
            this.dbConnection.all(`SELECT * FROM ${CITY_TABLE_NAME} WHERE ${CITY_TABLE_NAME}.${CITY_TABLE_ID_NAME}=${cityId}`, {
                $cityId: cityId
            }, (err,rows) => {
                if (err) {
                    //console.log(`Error getting city with cityId = ${cityId}`);
                    reject(err);
                }
                resolve(rows);
            })
        } else {
            this.dbConnection.all(`SELECT * FROM ${CITY_TABLE_NAME} `, (err,rows) => {
                if (err) {
                    //console.log(`Error getting all cities : ${err}`);
                    reject(err);
                }
                resolve(rows);
            })
        }

        });
            
    }
    
    static selectCountries(countryId = null ) {
        
        return new Promise((resolve,reject) => {
            this.dbConnection = DataRepository.getDbConnector();
            
            if (countryId != null ) {
                this.dbConnection.all(`SELECT * FROM ${COUNTRY_TABLE_NAME} WHERE ${COUNTRY_TABLE_NAME}.${COUNTRY_TABLE_ID_NAME}=${countryId}`, {
                    $countryId: countryId
                }, (err,rows) => {
                    if (err) {
                        
                        reject(err);
                    }
                    resolve(rows);
                })
            } else {
                this.dbConnection.all(`SELECT * FROM ${COUNTRY_TABLE_NAME} `, (err,rows) => {
                    if (err) {
                        
                        reject(err);
                    }
                    resolve(rows);
                })
            }

        });
            
    }

    static selectStates(stateId = null ) {
        this.dbConnection = DataRepository.getDbConnector();
        return new Promise((resolve,reject) => {
            
        
        if (stateId != null ) {
            this.dbConnection.all(`SELECT * FROM ${STATE_TABLE_NAME} WHERE ${STATE_TABLE_NAME}.${STATE_TABLE_ID_NAME}=${stateId}`, {
                $stateId: stateId
            }, (err,rows) => {
                if (err) {
                    
                    reject(err);
                }
                resolve(rows);
            })
        } else {
            this.dbConnection.all(`SELECT * FROM ${STATE_TABLE_NAME} `, (err,rows) => {
                if (err) {
                    
                    reject(err);
                }
                resolve(rows);
            })
        }

        });
            
    }

    static getDropAndCreateTableWorldCitiesQuery() {
        return new Promise((resolve, reject) => {
            
            let worldCitiesSqlFile = 'db/sql/dropCreateWorldSqliteCompatible.sql';
            fileReader.readFile(worldCitiesSqlFile, 'utf8', (err,data) => {
                if (err) 
                    reject(err) ;
                resolve(data);
                
            });

        });
    }
    static getInsertTableWorldCitiesQuery() {
        return new Promise((resolve, reject) => {
            
            
            let insertWorldSql = 'db/sql/insertWorld.sql'
            fileReader.readFile(insertWorldSql, 'utf8', (err,data) => {
                if (err) 
                    reject(err) ;
                resolve(data);
                
            });

        });

    }

}


exports.DataRepository = DataRepository;
