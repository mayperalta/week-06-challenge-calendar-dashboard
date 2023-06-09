// # 06 Server-Side APIs: Weather Dashboard
// Displays the weather outlook for multiple cities. 

// algorithm
// 1 - get city input by user and store value in local storage
// 2 - local storage will list up to 10 cities
// 3 - request URL from ipen weather API and return data in JASON format
// 5 - Add click event listener so when someone clicks on search city it..
// 6 - searches city on API
// 7 - displays weather details of that city
// 8 - displays weather forecast of that city in 5 days 

var weatherApiKey = '22624c048bc9b7ce50325f546ff45499';
var searchBtn = $('#search-city-btn');
var pastCities = $('#searched-city');
var currentCity; 
var recentSearch = JSON.parse(localStorage.getItem("historyArray")) || []; // look into local storage for an array called historyArray leave as empty array if doesn't exist

// function to get the lat and lon from API
searchBtn.on("click", function() {
    var inputCity = $('#city').val();
    const capitalizedCity =
    inputCity.charAt(0).toUpperCase()
        + inputCity.slice(1)
    searchHistory(capitalizedCity);
    geoCode(capitalizedCity); 
});

// search history 
function searchHistory(city) {
    if (recentSearch.includes(city)) {
        return;
    }

    // var historyTab = document.getElementById("city-history");
    var linkTabEl = document.getElementById("searched-city");
    var historyTab = document.createElement("button");
    historyTab.classList.add("button", "is-fullwidth", "panel-block", "searched-btn");

    historyTab.textContent = city;
    historyTab.setAttribute("value", city);
    historyTab.addEventListener("click", function() {
        geoCode(city);
    })
    // document.getElementById("searched-city").append(historyTab);
    linkTabEl.appendChild(historyTab);
}

function renderHistory(city) {
    // var historyTab = document.getElementById("city-history");
    var linkTabEl = document.getElementById("searched-city");
    var historyTab = document.createElement("button");
    historyTab.classList.add("button", "is-fullwidth", "panel-block");

    historyTab.textContent = city;
    historyTab.setAttribute("value", city);
    historyTab.addEventListener("click", function() {
        geoCode(city);
    })
    //document.getElementById("searched-city").append(historyTab); // adds button below id searched-city
    linkTabEl.appendChild(historyTab);
}

for(var i=0; i < recentSearch.length; i++) {
    renderHistory(recentSearch[i]);
}

// get city, latitude, and longtitude
function geoCode(city) {
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${weatherApiKey}`; 
    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then( function(data) {
            console.log(data);
            
            recentSearch.push(city); // takes the newest city that we searched for and pushes it to recent search array
            localStorage.setItem("historyArray", JSON.stringify(recentSearch));  // rewrite history array in local storage to match the current state of recent search array
            getWeather(data[0].lat, data[0].lon, city)
        })
}

// access object elements in JSON and display on page
function getWeather(lat, lon, city) {
    var requestUrl = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${weatherApiKey}`
    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then( function(data) {
            console.log(data);
            document.getElementById("city-weather").innerHTML = ""; 

            // create city weather container
            var cityWeatherEl = document.createElement("div");
            cityWeatherEl.classList.add("column",  "is-full");
            cityWeatherEl.setAttribute("id", "forecast-container");
            document.getElementById("city-weather").append(cityWeatherEl);

             // get data for city, date, and icon, temp, humidity, wind
            var cityName = document.createElement("h2");
            cityName.classList.add("subtitle", "is-3");
            cityName.textContent = city;

            var getToday = moment;
            var date = document.createElement("span");
            date.textContent = " (" + getToday.unix(data.current.dt).format("MM/DD/YY") + ") ";

            var icon = document.createElement("img");
            icon.setAttribute("src",`http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`)

            var temp = document.createElement("p");
            temp.classList.add("subtitle", "is-5");
            temp.textContent = "Temp: " + data.current.temp + " F";

            var wind= document.createElement("p");
            wind.classList.add("subtitle", "is-5");
            wind.textContent = "Wind: " +  data.current.wind_speed + " MPH";

            var humidity= document.createElement("span");
            humidity.classList.add("subtitle", "is-5");
            humidity.textContent = "Humidity: " + data.current.humidity + " %";

            // display data for city, date, icon, temp, humidity, wind
            cityWeatherEl.appendChild(cityName);
            cityName.appendChild(date);
            cityName.appendChild(icon);
            cityWeatherEl.appendChild(temp);
            cityWeatherEl.appendChild(wind);
            cityWeatherEl.appendChild(humidity);

            // display 5 forecast title
            var forecastEl = document.createElement("div");
            forecastEl.classList.add("column",  "is-full");
            cityWeatherEl.append(forecastEl);

            var forecastTitle = document.createElement("h2");
            forecastTitle.classList.add("subtitle", "is-3");
            forecastTitle.innerHTML =  "5-day Forecast: ";
            cityWeatherEl.appendChild(forecastTitle);

            //create forecast container
            var forecastEl  = document.createElement("div");
            forecastEl.classList.add("column",  "is-full");
            cityWeatherEl.append(forecastEl);

             //create forecast container
             var forecastSubEl  = document.createElement("div");
             forecastSubEl.classList.add("columns",  "is-gap");
             forecastEl.appendChild(forecastSubEl);


            // display 5-day forecast for icon, temp, wind, humidity
            for (var i=0; i <= 4; i++) {

                // add city forecast sub container
                var forecastContainer = document.createElement("div");
                forecastContainer.classList.add("column", "forecast-container");
                forecastSubEl.append(forecastContainer);
                //document.getElementById("city-forecast").append(forecastContainer);

                // add city forecast elements
                var futureDate = document.createElement("p");
                futureDate.classList.add("subtitle",  "is-6" + i);
                futureDate.textContent = getToday.unix(data.current.dt).add (i, "d").format("MM/DD/YY");
                forecastContainer.appendChild(futureDate);

                var futureIcon = document.createElement("img");
                futureIcon.setAttribute("src",`http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`)
                forecastContainer.append(futureIcon);

                var futureTemp = document.createElement("p");
                futureTemp.classList.add("subtitle",  "is-6" + i);
                futureTemp.textContent = "Temp: " + data.daily[i].temp.day + " F";
                forecastContainer.append(futureTemp);

                var futureWind= document.createElement("p");
                futureWind.classList.add("subtitle",  "is-6" + i);
                futureWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
                forecastContainer.append(futureWind);

                var futureHumidity= document.createElement("p");
                futureHumidity.classList.add("subtitle",  "is-6" + i);
                futureHumidity.textContent = "Humidity: " + data.daily[i].humidity + " %";
                forecastContainer.append(futureHumidity);

            }
        })
    }

  




