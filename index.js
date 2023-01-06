var request = new XMLHttpRequest(); //AJAX 


request.open('GET', 'https://api.openweathermap.org/data/3.0/onecall?lat=40.73&lon=-73.93&appid=e6ecdc4bd5a5838f90e16fc149c2e8de&units=imperial&exclude=minutely', true); // last arg is for asynch method
request.responseType = 'text'; //Insure that JSON comes in correctly
request.onreadystatechange = function () { //Not necessary
    console.log(request.readyState, request.status, request.statusText) //If success: 1-4 (whats going on in stages of request), 200, "OK"
}

request.onload = function(){
    if (request.status == 200) {
        let weatherObj = JSON.parse(request.responseText)
        console.log(weatherObj)
        displayCurrentWeather(weatherObj);
        createContainers(weatherObj);
    }
}
request.send();

function displayCurrentWeather(weatherObj) {
    document.querySelector("#temperature").textContent = `${weatherObj.current.temp.toFixed(1)} \xB0`;
    document.querySelector("#weather").textContent = `${weatherObj.current.weather[0].main}`;
    document.querySelector("#feel").textContent += `${weatherObj.current.feels_like.toFixed(1)} \xB0`;
    document.querySelector("#desc").textContent += `${weatherObj.current.wind_speed} mph `;
    document.querySelector("#uvi").textContent +=`${weatherObj.current.uvi}`;
    let windDirDeg = weatherObj.current.wind_deg;
    document.querySelector("#desc").textContent += getWindDirection(windDirDeg);
    let sunrise = weatherObj.current.sunrise;
    let sunset = weatherObj.current.sunset;
    let timeSunset = new Date(sunset*1000);
    let timeSunrise = new Date(sunrise*1000)
    document.querySelector("#sunrise").textContent += timeSunrise.toLocaleTimeString("us",{timeZone: "America/New_York"});
    document.querySelector("#sunset").textContent += timeSunset.toLocaleTimeString("us", {timeZone: weatherObj.timezone});
    //Add percipitation and visibility
    document.querySelector("#visibility").textContent += `${weatherObj.current.visibility} ft`
    if (weatherObj.current.rain!==undefined) {
        document.querySelector("#ppt").textContent += `${weatherObj.current.rain} in`;
    } else {
        document.querySelector("#ppt").textContent = 'No Precipitation';
    }
    
}   
function getWindDirection(deg) {
    let dirDeg = Math.floor(deg/22.5);
    let direction;
    switch (dirDeg) {
        case 0:
        case 16:
            return direction = "N";
        case 1:
            return direction = "NNE";
        case 2:
            return direction = "NE";
        case 3:
            return direction ="ENE";
        case 4: 
            return direction = "E";
        case 5:
            return direction = "ESE";
        case 6:
            return direction = "SE";
        case 7:
            return direction = "SSE";
        case 8: 
            return direction = "S";
        case 9:
            return direction = "SSW";
        case 10:
            return direction = "SW";
        case 11:
            return direction = "WSW";
        case 12: 
            return direction = "W";
        case 13:
            return direction = "WNW";
        case 14:
            return direction = "NW";
        case 15:
            return direction = "NNW";            
    }

}

let dailyWeatherCont = document.querySelector("#right");

function createContainers(weatherObj) {
    for (let i=1; i<weatherObj.daily.length; i++){
        //Get and format the date
        let dateInMs = weatherObj.daily[i].dt*1000;
        let date = new Date(dateInMs);
        let fullDate = date.toLocaleDateString("us", {dateStyle: "long"})
        console.log(fullDate);
        //Create containers
        let dayContainer = document.createElement('div');
        dayContainer.className = "dayContainer";
        let dayDate = document.createElement('span');
        dayDate.className = 'dayDate';
        dayDate.textContent = fullDate;
        dayContainer.appendChild(dayDate);
        let dayIconCont = document.createElement('span');
        let dayIcon = document.createElement('img');
        dayIcon.src = `//openweathermap.org/img/w/${weatherObj.daily[i].weather[0].icon}.png`
        dayContainer.appendChild(dayIconCont);
        dayIconCont.appendChild(dayIcon);
        dailyWeatherCont.appendChild(dayContainer);
        let dayTempMin = document.createElement('span');
        let tempMin = weatherObj.daily[i].temp.min.toFixed(1);
        dayTempMin.textContent = `${tempMin} \xB0`;
        dayContainer.appendChild(dayTempMin);
        let dayTempMax = document.createElement('span');
        let tempMax = weatherObj.daily[i].temp.max.toFixed(1);
        dayTempMax.textContent = `${tempMax} \xB0`;
        dayContainer.appendChild(dayTempMax);
    }
}