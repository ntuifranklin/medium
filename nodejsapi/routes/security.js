const request = require('request');

let options = {json: true};
today = new Date();
thisYear = today.getFullYear();
thisMonth = today.getMonth() + 1;
thisDay = today.getDate();
last90Days = new Date(today.setDate(today.getDate() - 1825));
last3MonthsYear = last90Days.getFullYear();
last3MonthsMonth = last90Days.getMonth() + 1 ;
last3MonthsDay = last90Days.getDate();

function retrieveSecurity(securityType="Bill", format="json") {

    if (securityType == 'Note') {
        // extend years by 5 at least 
    }
    url = `https://www.treasurydirect.gov/TA_WS/securities/search?format=${format}&securityType=${securityType}`;
    return new Promise((resolve, reject) => {
        if ( format == "json")
            options = {json:true};
        else
            options = {html:true} ;

        request(url, options, (error, res, body) => {
            if (error) {
                console.log(error) ;
                reject(error);
            };

            if (!error && res.statusCode == 200) {
                //console.log(`${body}`);
                resolve(body);
            };
        });


    }) ;
} ;


exports.retrieveSecurity = retrieveSecurity
