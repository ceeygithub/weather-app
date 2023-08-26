

// Declare these variables outside the functions so they can be accessed globally
let celsiusLink = document.querySelector("#toggle-celsius");
let fahrenheitLink = document.querySelector("#toggle-fahrenheit");
let temp; // Declare this variable to store the temperature globally


function newPosition(position) {
    // Get latitude and longitude from the geolocation
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;


    // API key for accessing OpenWeatherMap API
    let apiKey = "597c40c39084687093b091cd48b366f8";

    // Construct the API URL for current weather data using latitude, longitude, and API key
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then((response) => {
        let city = response.data.name;
        temp = response.data.main.temp;
        let humidity = response.data.main.humidity;
        let visibility = response.data.visibility / 1000;
        let wind = response.data.wind.speed;
        let weather = response.data.weather[0].description;
        let icon = response.data.weather[0].icon;
        let timestamp = response.data.dt; // Unix timestamp
        let timezoneOffset = response.data.timezone; // Timezone offset in seconds

        let currentTime = new Date((timestamp + timezoneOffset) * 1000);

        // Format the day and time
        let options = { weekday: 'short', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
        let formattedTime = currentTime.toLocaleString('en-US', options);

        let timeElement = document.querySelector("#time-card");
        timeElement.textContent = `${formattedTime}`;


        let dewElement = document.querySelector("#dew");
        // Calculate dew point using temperature and humidity
        let dew = calculateDewPoint(temp, humidity);
        dewElement.textContent = `${dew.toFixed(2)} °C`;

        let iconElement = document.querySelector("#img");
        iconElement.src = `https://openweathermap.org/img/w/${icon}.png`;

        let weatherElement = document.querySelector("#weather");
        weatherElement.textContent = weather;

        let cityElement = document.querySelector("#searched-city");
        cityElement.textContent = `Current location  ${city}`;

        let temperatureElement = document.querySelector("#temperature");
        temperatureElement.innerHTML = `<h1>${Math.round(temp)}</h1>`;

        let humidityElement = document.querySelector("#humidity")
        humidityElement.textContent = `${humidity}%`;

        let visibilityElement = document.querySelector("#visibility")
        visibilityElement.textContent = `${visibility.toFixed(2)} km`;

        let windElement = document.querySelector("#wind")
        windElement.textContent = `${wind} km/h`;


        // Add event listeners for temperature unit conversion
        fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
        celsiusLink.addEventListener("click", displayCelsiusTemperature);

        getForecast(response.data.coord)
        hourlyForecast(response.data.coord)
    });


}

function handleFormSubmit(event) {
    event.preventDefault();

    let searchInput = document.querySelector("#city-input");
    let cityName = searchInput.value;

    let apiKey = "597c40c39084687093b091cd48b366f8";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then((response) => {
        let city = response.data.name;
        temp = response.data.main.temp;
        let humidity = response.data.main.humidity;
        let visibility = response.data.visibility / 1000;
        let wind = response.data.wind.speed;
        let weather = response.data.weather[0].description;
        let icon = response.data.weather[0].icon;

        // Extract timestamp and timezone offset from the API response
        let timestamp = response.data.dt; // Unix timestamp
        let timezoneOffset = response.data.timezone; // Timezone offset in seconds

        let currentTime = new Date((timestamp + timezoneOffset) * 1000);


        // Format the current time as "day, HH:mm"
        let options = { weekday: 'short', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
        let formattedTime = currentTime.toLocaleString('en-US', options);

        let timeElement = document.querySelector("#time-card");
        timeElement.textContent = ` ${formattedTime}`;


        let dewElement = document.querySelector("#dew");
        // Calculate dew point using temperature and humidity
        let dew = calculateDewPoint(temp, humidity);
        dewElement.textContent = `${dew.toFixed(2)} °C`;
        // Update the weather icon using the provided icon code
        let iconElement = document.querySelector("#img");
        iconElement.src = `https://openweathermap.org/img/w/${icon}.png`;

        let weatherElement = document.querySelector("#weather");
        weatherElement.textContent = weather;

        let cityElement = document.querySelector("#searched-city");
        cityElement.textContent = city;

        let temperatureElement = document.querySelector("#temperature");
        temperatureElement.innerHTML = `<h1>${Math.round(temp)}</h1>`;

        let humidityElement = document.querySelector("#humidity")
        humidityElement.textContent = `${humidity}%`;

        let visibilityElement = document.querySelector("#visibility")
        visibilityElement.textContent = `${visibility.toFixed(2)} km`;

        let windElement = document.querySelector("#wind")
        windElement.textContent = `${wind} km/h`;


        // Add event listeners for temperature unit conversion
        fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
        celsiusLink.addEventListener("click", displayCelsiusTemperature);
    });
}

// Function to calculate dew point
function calculateDewPoint(temperature, humidity) {
    const a = 17.27;
    const b = 237.7;

    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint;
};

function displayFahrenheitTemperature(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");

    // Calculate and display Fahrenheit temperature
    let fahrenheitTemperature = (temp * 9) / 5 + 32;
    temperatureElement.innerHTML = `<h1>${Math.round(fahrenheitTemperature)}</h1>`;

    // Update class to show active state for Fahrenheit link
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
}

function displayCelsiusTemperature(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");

    // Display Celsius temperature
    temperatureElement.innerHTML = `<h1>${Math.round(temp)}</h1>`;

    // Update class to show active state for Celsius link
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
}
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
celsiusLink.addEventListener("click", displayCelsiusTemperature);

// Initial call to get the user's geolocation
navigator.geolocation.getCurrentPosition(newPosition);

// Add event listener for form submission
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleFormSubmit);


function getForecast(coordinates) {
    let apiKey = "597c40c39084687093b091cd48b366f8";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}
function hourlyForecast(coordinates) {
    let apiKey = "597c40c39084687093b091cd48b366f8";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayHourlyForecast);
}

// Function to get hourly forecast
function displayHourlyForecast(response) {
    let forecastElement = document.querySelector("#forecast");

    // Access the hourly forecast data
    let hourlyForecasts = response.data.hourly.slice(0, 8); // Get the first 8 hourly forecasts
    let forecastHTML = `
       
            <p class="weather">Today's Weather</p>
            <div class="row m-0 p-0 grid gap-2">
    `;

    hourlyForecasts.forEach(function (hourly, index) {
        let time = new Date(hourly.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        let temp = hourly.temp;
        let icon = hourly.weather[0].icon;
        forecastHTML += `
            <div class="col border light-subtle rounded shadow-sm">
                <p id="hour">${time}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
                <p id="hour-temp">${temp.toFixed(0)}&deg;</p>
            </div>
        `;
    });

    forecastHTML += `
            </div>
       
    `;

    forecastElement.innerHTML = forecastHTML;
}

//let hourlyClick = document.querySelector(".hourly-btn");
//hourlyClick.addEventListener("click", displayHourlyForecast);

// Function to display daily forecast
function displayForecast(position) {
    let forecastElement = document.querySelector(".table");
    let days = ["Thu", "Fri", "Sat", "Sun", "Mon"];
    let dailyForecasts = position.data.daily;
    console.log(dailyForecasts);

    let forecastHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th colspan="6">Next five days</th>
                </tr>
            </thead>
            <tbody class="table-group-divider">
    `;

    days.forEach(function (dayName, index) {
        let day = dailyForecasts[index];
        let lowTemp = day.temp.min;
        let highTemp = day.temp.max;
        let windSpeed = day.wind_speed;
        let rain = day.rain ? day.rain : 0;
        let icon = day.weather[0].icon;
        let date = new Date(day.dt * 1000); // Convert Unix timestamp to Date
        let formattedDate = `${date.getDate()}/${date.getMonth() + 1}`; // Get day and month

        forecastHTML += `
            <tr>
                <th scope="row">${dayName}<br>${formattedDate}</th>
               <td><img src=" https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon"></td>
                <td>${lowTemp.toFixed(0)}°C<br>Low</td>
                <td>${highTemp.toFixed(0)}°C<br>High</td>
                <td>${windSpeed.toFixed(0)} m/s<br>Wind</td>
                <td>${rain}%<br>Rain</td>
            </tr>
        `;
    });

    forecastHTML += `
            </tbody>
        </table>
    `;

    forecastElement.innerHTML = forecastHTML;
}
