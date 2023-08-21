


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
        let temp = response.data.main.temp;
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
        temperatureElement.innerHTML = `<h1>${Math.round(temp)}℃</h1>`;

        let humidityElement = document.querySelector("#humidity")
        humidityElement.textContent = `${humidity}%`;

        let visibilityElement = document.querySelector("#visibility")
        visibilityElement.textContent = `${visibility.toFixed(2)} km`;

        let windElement = document.querySelector("#wind")
        windElement.textContent = `${wind} km/h`;

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
        let temp = response.data.main.temp;
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
        temperatureElement.innerHTML = `<h1>${Math.round(temp)}℃</h1>`;

        let humidityElement = document.querySelector("#humidity")
        humidityElement.textContent = `${humidity}%`;

        let visibilityElement = document.querySelector("#visibility")
        visibilityElement.textContent = `${visibility.toFixed(2)} km`;

        let windElement = document.querySelector("#wind")
        windElement.textContent = `${wind} km/h`;

    });
};

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleFormSubmit);

navigator.geolocation.getCurrentPosition(newPosition);


// Function to calculate dew point
function calculateDewPoint(temperature, humidity) {
    const a = 17.27;
    const b = 237.7;

    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint;
};


