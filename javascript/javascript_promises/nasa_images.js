
/* Nasa images url listing  */     
function getNASA_MArsImages() {
    return new Promise(async(resolve,reject) => {
        try{
                    
                let apiKey = `XM4XQBZ4LUqtfdYKFLZNskrk8R1v7Jecvdg3R9Pn`;
                var url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${apiKey}`;

                const response = await fetch(url);
                const jsonData = await response.json();
                resolve(jsonData);

        } catch(e) {
                reject(e);
        }

    });
}


getNASA_MArsImages().
then(async (jsonData) => {
    let photos = await jsonData["photos"];
    for(let i=0; i < photos.length; i++) 
        console.log(photos[i].img_src);
       
       
}).
catch(e => console.log(e));