let date = new Date();

function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = days[date.getDay()];
  let month = months[date.getMonth()];
  let currentDate = date.getDate();

  let currentHour = date.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  let fullDate = document.querySelector("#current-date");
  fullDate.innerHTML = `${month} ${currentDate} ${day} ${currentHour}:${currentMinutes}`;

  return fullDate;
}

formatDate(date);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class ="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
       <div class="card">
         <div class="card-body">
           <span class="week-day">${formatDay(forecastDay.dt)}</span>
           <br />
           <img
           src="http://openweathermap.org/img/wn/${
             forecastDay.weather[0].icon
           }@2x.png"
           alt=""
           width="42"
           <br />
           <span class="forecast-temp-high">${Math.round(
             forecastDay.temp.max
           )}°</span>
           <span class="forecast-temp-low"> ${Math.round(
             forecastDay.temp.min
           )}°</span>
        </div>
      </div>
     </div> 
        `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "d1ad1fd86963fc94e9e69de9fcb0e5bc";
  let apiUrl = `https:api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  highCelsiusTemperature = response.data.main.temp_max;
  lowCelsiusTemperature = response.data.main.temp_min;

  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#high-temperature").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#low-temperature").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "d1ad1fd86963fc94e9e69de9fcb0e5bc";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function searchNewCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-search").value;
  search(city);
}

function searchLocation(position) {
  let apiKey = "d1ad1fd86963fc94e9e69de9fcb0e5bc";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayFahrenheit(event) {
  event.preventDefault();
  let highTemperatureElement = document.querySelector("#high-temperature");
  let lowTemperatureElement = document.querySelector("#low-temperature");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let highFarenheitTemperature = (12 * 9) / 5 + 32;
  let lowFarenheitTemperature = (8 * 9) / 5 + 32;

  highTemperatureElement.innerHTML = Math.round(highFarenheitTemperature);
  lowTemperatureElement.innerHTML = Math.round(lowFarenheitTemperature);
}

function displayCelsius(event) {
  event.preventDefault();
  let highTemperatureElement = document.querySelector("#high-temperature");
  let lowTemperatureElement = document.querySelector("#low-temperature");

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  highTemperatureElement.innerHTML = Math.round(highCelsiusTemperature);
  lowTemperatureElement.innerHTML = Math.round(lowCelsiusTemperature);
}

let currentLocationButton = document.querySelector("#current");
currentLocationButton.addEventListener("click", getCurrentLocation);

let highCelsiusTemperature = null;
let lowCelsiusTemperature = null;

let form = document.querySelector("form");
form.addEventListener("submit", searchNewCity);

let fahrenheitLink = document.querySelector("#farenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

search("Seattle");
