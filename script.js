async function getWeather() {
  const city = document.getElementById("city").value.trim();
  const result = document.getElementById("result");

  if (!city) {
    result.textContent = "Please enter a city name.";
    return;
  }

  result.textContent = "Finding weather...";

  try {
    const geoResponse = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(city) + "&count=1"
    );

    const locations = await geoResponse.json();

    if (!locations.results || locations.results.length === 0) {
      throw new Error("City not found.");
    }

    const place = locations.results[0];

    const weatherUrl =
      "https://api.open-meteo.com/v1/forecast?" +
      new URLSearchParams({
        latitude: place.latitude,
        longitude: place.longitude,
        current:
          "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
      });

    const response = await fetch(weatherUrl);
    const data = await response.json();
    const weather = data.current;

    result.innerHTML =
      "<h2>" + place.name + "</h2>" +
      "<h1>" + weather.temperature_2m + "°C</h1>" +
      "Humidity: " + weather.relative_humidity_2m + "%<br>" +
      "Wind: " + weather.wind_speed_10m + " km/h<br>" +
      "<p>Weather code: " + weather.weather_code + "</p>" +
      "<p>Forecast information only. Follow official weather alerts.</p>";

  } catch (error) {
    result.textContent = "Weather unavailable: " + error.message;
  }
}

getWeather();
