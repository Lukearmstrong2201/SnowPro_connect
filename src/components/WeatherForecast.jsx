import React from "react";
import "../styles/WeatherForecast.css";

export default function WeatherForecast({ forecastData }) {
  if (!forecastData || forecastData.length === 0) return null;

  const dailyData = forecastData.filter((_, index) => index % 8 === 0);

  return (
    <div className="weather-forecast">
      <h4>5-Day Weather Forecast</h4>
      <div className="forecast-grid">
        {dailyData.map((entry) => (
          <div key={entry.dt} className="forecast-card">
            <p>{new Date(entry.dt_txt).toLocaleDateString()}</p>
            <img
              src={`https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`}
              alt={entry.weather[0].description}
            />
            <p>{entry.weather[0].main}</p>
            <p>{Math.round(entry.main.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}
