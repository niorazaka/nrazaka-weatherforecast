// clé pour OpenCage Geocoder : e38fd27fc5034cd1830737f23c15dd91
// clé pour OpenWeather API : 42cb730c3d85115b3dee74a32ab1a5de
//
// utiliser axios ou fetch pour pouvoir recup des données
// (axios pour front + back / fetch pour front)

document.addEventListener('DOMContentLoaded', (event) => {
    /* une fois que le doc a chargé, on veut :
    -addeventlistener submit pour pouvoir utiliser l'input */
    const myForm = document.getElementById("form");
    myForm.addEventListener("submit", function(event){
        /* eviter que la page refresh automatiquement */
        event.preventDefault();
        /*-récup la ville input variable qui appelle la "valeur" entrée en input */
        const cityInput = document.getElementById("city").value;
        console.log(cityInput); //OK!
        
        // on a pas le droit decrire getForecast(getCoord(cityInput)) car c'est de lasynchrone
        // donc on utilise le mot clef then qui permet d'executer les instructions "une fois que" on a récupérer les infos
        getCoord(cityInput) 
        .then(coord => {
            getForecast(coord)
            .then(weatherData => {
                // ici on a acces a la meteo de la semaine
                    let tempsDuJour = "";

                    for (let i = 0; i < 7; i++) {
                        tempsDuJour = weatherData.daily[i].weather[0].description;
                        console.log(tempsDuJour); //OK ! Valeurs renvoyées pour chaque jour
                        displayImage(tempsDuJour);
                    }
            })

        })
      
        //getForecast(latitude, longitude); 
    })
});


// 1. récupérer les coordonnées d'une ville EX : PARIS
function getCoord(cityInput) {
    // Make a request to an API
    return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${cityInput}&key=e38fd27fc5034cd1830737f23c15dd91`)
        .then( response => {
        // handle success
            return response.json();
            })
        .then(data => {
            let latitude = data.results[0].geometry.lat;//latitude
            let longitude = data.results[0].geometry.lng;//longitude
            let coord = {lat : latitude, lon : longitude};
            return coord
            // console.log(latitude); //48.8588897
            // console.log(longitude); //2.320041
            
        })
        .catch(error => {
            console.log(error)
        });
}

// 2. récupérer les prévisions météo de cette ville
function getForecast(coord) {
    // Make a request to an API
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly&appid=42cb730c3d85115b3dee74a32ab1a5de`)//COMMENT AJOUTER COORDONNEES DANS URL ?
        .then( response => {
            // handle success
            return response.json();
        })
        .then(weatherData => {
            return weatherData
        })
        .catch(error => {
            console.log(error)
        });
    
}

// 3. afficher les images correspondantes à la meteo 
function displayImage(tempsDuJour){
    let divContainer = document.getElementById("boxContainer"); //select la div où mettre les images
    let divBox = document.createElement("div");//créer des sous div  dans le html pour chaque image (pcq div = h3 pour le jour + img pour l'image)
    let img = document.createElement("img"); //créer l'element img dans le html

    switch (tempsDuJour) {
        case "overcast clouds":
            img.src = "./icones/clouds.svg"; //= indiquer source de img
            break;
        case "broken clouds":
        case "few clouds":
        case "scattered clouds":
            img.src = "./icones/cloudy.svg";
            break;
        case "heavy intensity rain":
        case "light rain":
        case "moderate rain":
            img.src = "./icones/rain.svg";
            break;
        case "light snow":
        case "rain and snow":
        case "snow":
            img.src = "./icones/snow.svg";
            break;
        case "clear sky":
            img.src = "./icones/sun.svg";
            break;
        }
    let p = document.createElement("p");
    p.textContent = "Jour";
    divBox.append(p);
    divBox.append(img); //= insérer img dans div
    divContainer.append(divBox);
}