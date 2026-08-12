/* ------------------------------------------------------------
   Estação — api.js
   Busca coordenadas (geocoding) e clima atual (forecast)
   usando exclusivamente a API pública Open-Meteo.
   Docs: https://open-meteo.com/en/docs
   ------------------------------------------------------------ */

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Faixa de temperatura usada para preencher o "gauge" circular (°C)
const GAUGE_MIN = -10;
const GAUGE_MAX = 40;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 88; // r=88, ver style.css

// Tradução simplificada dos "weather codes" da Open-Meteo (WMO)
// https://open-meteo.com/en/docs#weathervariables
const WEATHER_CODES = {
  0: { text: "Céu limpo", icon: "☀️" },
  1: { text: "Predominantemente limpo", icon: "🌤️" },
  2: { text: "Parcialmente nublado", icon: "⛅" },
  3: { text: "Nublado", icon: "☁️" },
  45: { text: "Névoa", icon: "🌫️" },
  48: { text: "Névoa com geada", icon: "🌫️" },
  51: { text: "Garoa fraca", icon: "🌦️" },
  53: { text: "Garoa moderada", icon: "🌦️" },
  55: { text: "Garoa intensa", icon: "🌧️" },
  56: { text: "Garoa congelante fraca", icon: "🌧️" },
  57: { text: "Garoa congelante intensa", icon: "🌧️" },
  61: { text: "Chuva fraca", icon: "🌧️" },
  63: { text: "Chuva moderada", icon: "🌧️" },
  65: { text: "Chuva forte", icon: "🌧️" },
  66: { text: "Chuva congelante fraca", icon: "🌧️" },
  67: { text: "Chuva congelante forte", icon: "🌧️" },
  71: { text: "Neve fraca", icon: "🌨️" },
  73: { text: "Neve moderada", icon: "🌨️" },
  75: { text: "Neve forte", icon: "❄️" },
  77: { text: "Grãos de neve", icon: "❄️" },
  80: { text: "Pancadas de chuva fracas", icon: "🌦️" },
  81: { text: "Pancadas de chuva moderadas", icon: "🌧️" },
  82: { text: "Pancadas de chuva fortes", icon: "⛈️" },
  85: { text: "Pancadas de neve fracas", icon: "🌨️" },
  86: { text: "Pancadas de neve fortes", icon: "❄️" },
  95: { text: "Trovoada", icon: "⛈️" },
  96: { text: "Trovoada com granizo fraco", icon: "⛈️" },
  99: { text: "Trovoada com granizo forte", icon: "⛈️" },
};

// ------------------------------------------------------------
// Elementos do DOM
// ------------------------------------------------------------
const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

const cityNameEl = document.getElementById("cityName");
const cityMetaEl = document.getElementById("cityMeta");
const temperatureEl = document.getElementById("temperature");
const gaugeFillEl = document.getElementById("gaugeFill");
const conditionIconEl = document.getElementById("conditionIcon");
const conditionTextEl = document.getElementById("conditionText");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const windDirEl = document.getElementById("windDir");
const coordsEl = document.getElementById("coords");

// Prepara o círculo do gauge (offset inicial = escondido)
gaugeFillEl.style.strokeDasharray = `${GAUGE_CIRCUMFERENCE}`;
gaugeFillEl.style.strokeDashoffset = `${GAUGE_CIRCUMFERENCE}`;

// ------------------------------------------------------------
// Helpers de UI
// ------------------------------------------------------------
function showStatus(message, tone = "info") {
  statusEl.hidden = false;
  statusEl.textContent = message;
  statusEl.dataset.tone = tone;
}

function hideStatus() {
  statusEl.hidden = true;
  statusEl.textContent = "";
  delete statusEl.dataset.tone;
}

function degreesToCompass(deg) {
  const directions = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

function setGauge(temperature) {
  const clamped = Math.min(Math.max(temperature, GAUGE_MIN), GAUGE_MAX);
  const ratio = (clamped - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN);
  const offset = GAUGE_CIRCUMFERENCE * (1 - ratio);
  // pequeno delay para garantir a transição CSS
  requestAnimationFrame(() => {
    gaugeFillEl.style.strokeDashoffset = `${offset}`;
  });
}

function renderWeather(place, current) {
  const weatherInfo = WEATHER_CODES[current.weather_code] || {
    text: "Condição desconhecida",
    icon: "🌡️",
  };

  cityNameEl.textContent = `${place.name}${place.admin1 ? `, ${place.admin1}` : ""}`;
  cityMetaEl.textContent = place.country || "";

  temperatureEl.textContent = Math.round(current.temperature_2m);
  setGauge(current.temperature_2m);

  conditionIconEl.textContent = weatherInfo.icon;
  conditionTextEl.textContent = weatherInfo.text;
  feelsLikeEl.textContent =
    current.apparent_temperature !== undefined
      ? `Sensação térmica: ${Math.round(current.apparent_temperature)}°C`
      : "";

  humidityEl.textContent = `${Math.round(current.relative_humidity_2m)}%`;
  windEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  windDirEl.textContent = degreesToCompass(current.wind_direction_10m);
  coordsEl.textContent = `${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}`;

  resultEl.hidden = false;
}

// ------------------------------------------------------------
// Chamadas à API Open-Meteo
// ------------------------------------------------------------

// 1) Geocoding: converte nome da cidade em latitude/longitude
async function geocodeCity(cityName) {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", cityName);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "pt");
  url.searchParams.set("format", "json");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Não foi possível consultar a busca de cidades.");
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`Cidade "${cityName}" não encontrada.`);
  }

  return data.results[0];
}

// 2) Forecast: busca o clima atual para as coordenadas encontradas
async function fetchCurrentWeather(latitude, longitude) {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(",")
  );
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Não foi possível consultar a previsão do tempo.");
  }

  const data = await response.json();
  if (!data.current) {
    throw new Error("A resposta da API não trouxe dados de clima atual.");
  }

  return data.current;
}

// ------------------------------------------------------------
// Fluxo principal
// ------------------------------------------------------------
async function handleSearch(event) {
  event.preventDefault();

  const city = cityInput.value.trim();
  if (!city) return;

  resultEl.hidden = true;
  showStatus(`Localizando "${city}"…`);

  try {
    const place = await geocodeCity(city);

    showStatus(`Consultando clima em ${place.name}…`);
    const current = await fetchCurrentWeather(place.latitude, place.longitude);

    hideStatus();
    renderWeather(place, current);
  } catch (error) {
    resultEl.hidden = true;
    showStatus(error.message || "Ocorreu um erro inesperado.", "error");
  }
}

form.addEventListener("submit", handleSearch);
