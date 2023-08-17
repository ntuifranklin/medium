var promiseMeAnEvenNumber = new Promise(function (resolve,reject){
    var floatingNumber = Math.random();
    var y = Math.ceil(floatingNumber * 999.0 );
    console.log(`Generated ${floatingNumber}`);
    if ( y % 2 == 0 )
        resolve(y);
    else
        reject(Error(`Sorry Even Number Not Generated: ${y}`));
    
});

promiseMeAnEvenNumber
.then(number => console.log(`We got ${number} as the promised output `))
.catch(e => console.log(` ${e} `));