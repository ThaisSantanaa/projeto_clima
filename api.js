/* ============================================================
   ESTAÇÃO.
   API de clima - Open-Meteo
   ============================================================ */


/* ============================================================
   URLs DAS APIs
   ============================================================ */

const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast";


/* ============================================================
   CONFIGURAÇÃO DA PREVISÃO
   ============================================================ */

const FORECAST_DAYS = 5;


/* ============================================================
   CONFIGURAÇÃO DO GAUGE
   ============================================================ */

const GAUGE_MIN = -10;
const GAUGE_MAX = 40;

const GAUGE_RADIUS = 88;

const GAUGE_CIRCUMFERENCE =
  2 * Math.PI * GAUGE_RADIUS;


/* ============================================================
   ELEMENTOS DO HTML
   ============================================================ */

const form =
  document.getElementById("searchForm");

const cityInput =
  document.getElementById("cityInput");

const statusEl =
  document.getElementById("status");

const resultEl =
  document.getElementById("result");

const cityNameEl =
  document.getElementById("cityName");

const cityMetaEl =
  document.getElementById("cityMeta");

const consultationDateEl =
  document.getElementById("consultationDate");

const temperatureEl =
  document.getElementById("temperature");

const gaugeFillEl =
  document.getElementById("gaugeFill");

const conditionIconEl =
  document.getElementById("conditionIcon");

const conditionTextEl =
  document.getElementById("conditionText");

const feelsLikeEl =
  document.getElementById("feelsLike");

const humidityEl =
  document.getElementById("humidity");

const windEl =
  document.getElementById("wind");

const windDirEl =
  document.getElementById("windDir");

const coordsEl =
  document.getElementById("coords");

const forecastListEl =
  document.getElementById("forecastList");


/* ============================================================
   CONFIGURAÇÃO INICIAL DO GAUGE
   ============================================================ */

if (gaugeFillEl) {

  gaugeFillEl.style.strokeDasharray =
    `${GAUGE_CIRCUMFERENCE}`;

  gaugeFillEl.style.strokeDashoffset =
    `${GAUGE_CIRCUMFERENCE}`;

}


/* ============================================================
   CÓDIGOS DO CLIMA - WMO
   ============================================================ */

const WEATHER_CODES = {

  0: {
    text: "Céu limpo",
    dayIcon: "wi-day-sunny",
    nightIcon: "wi-night-clear"
  },

  1: {
    text: "Predominantemente limpo",
    dayIcon: "wi-day-sunny-overcast",
    nightIcon: "wi-night-alt-partly-cloudy"
  },

  2: {
    text: "Parcialmente nublado",
    dayIcon: "wi-day-cloudy",
    nightIcon: "wi-night-alt-cloudy"
  },

  3: {
    text: "Nublado",
    dayIcon: "wi-cloudy",
    nightIcon: "wi-cloudy"
  },

  45: {
    text: "Névoa",
    dayIcon: "wi-day-fog",
    nightIcon: "wi-night-fog"
  },

  48: {
    text: "Névoa com geada",
    dayIcon: "wi-day-fog",
    nightIcon: "wi-night-fog"
  },

  51: {
    text: "Garoa fraca",
    dayIcon: "wi-day-sprinkle",
    nightIcon: "wi-night-alt-sprinkle"
  },

  53: {
    text: "Garoa moderada",
    dayIcon: "wi-day-sprinkle",
    nightIcon: "wi-night-alt-sprinkle"
  },

  55: {
    text: "Garoa intensa",
    dayIcon: "wi-day-rain",
    nightIcon: "wi-night-alt-rain"
  },

  56: {
    text: "Garoa congelante fraca",
    dayIcon: "wi-day-rain-mix",
    nightIcon: "wi-night-alt-rain-mix"
  },

  57: {
    text: "Garoa congelante intensa",
    dayIcon: "wi-day-rain-mix",
    nightIcon: "wi-night-alt-rain-mix"
  },

  61: {
    text: "Chuva fraca",
    dayIcon: "wi-day-rain",
    nightIcon: "wi-night-alt-rain"
  },

  63: {
    text: "Chuva moderada",
    dayIcon: "wi-day-rain",
    nightIcon: "wi-night-alt-rain"
  },

  65: {
    text: "Chuva forte",
    dayIcon: "wi-day-rain",
    nightIcon: "wi-night-alt-rain"
  },

  66: {
    text: "Chuva congelante fraca",
    dayIcon: "wi-day-rain-mix",
    nightIcon: "wi-night-alt-rain-mix"
  },

  67: {
    text: "Chuva congelante forte",
    dayIcon: "wi-day-rain-mix",
    nightIcon: "wi-night-alt-rain-mix"
  },

  71: {
    text: "Neve fraca",
    dayIcon: "wi-day-snow",
    nightIcon: "wi-night-alt-snow"
  },

  73: {
    text: "Neve moderada",
    dayIcon: "wi-day-snow",
    nightIcon: "wi-night-alt-snow"
  },

  75: {
    text: "Neve forte",
    dayIcon: "wi-day-snow",
    nightIcon: "wi-night-alt-snow"
  },

  77: {
    text: "Grãos de neve",
    dayIcon: "wi-snow"
  },

  80: {
    text: "Pancadas de chuva fracas",
    dayIcon: "wi-day-showers",
    nightIcon: "wi-night-alt-showers"
  },

  81: {
    text: "Pancadas de chuva moderadas",
    dayIcon: "wi-day-showers",
    nightIcon: "wi-night-alt-showers"
  },

  82: {
    text: "Pancadas de chuva fortes",
    dayIcon: "wi-day-showers",
    nightIcon: "wi-night-alt-showers"
  },

  85: {
    text: "Pancadas de neve fracas",
    dayIcon: "wi-day-snow",
    nightIcon: "wi-night-alt-snow"
  },

  86: {
    text: "Pancadas de neve fortes",
    dayIcon: "wi-day-snow",
    nightIcon: "wi-night-alt-snow"
  },

  95: {
    text: "Trovoada",
    dayIcon: "wi-day-thunderstorm",
    nightIcon: "wi-night-alt-thunderstorm"
  },

  96: {
    text: "Trovoada com granizo fraco",
    dayIcon: "wi-day-hail",
    nightIcon: "wi-night-alt-hail"
  },

  99: {
    text: "Trovoada com granizo forte",
    dayIcon: "wi-day-hail",
    nightIcon: "wi-night-alt-hail"
  }

};


/* ============================================================
   STATUS
   ============================================================ */

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


/* ============================================================
   DIREÇÃO DO VENTO
   ============================================================ */

function degreesToCompass(degrees) {

  if (
    degrees === undefined ||
    degrees === null ||
    Number.isNaN(degrees)
  ) {

    return "—";

  }


  const directions = [
    "N",
    "NE",
    "L",
    "SE",
    "S",
    "SO",
    "O",
    "NO"
  ];


  const index =
    Math.round(degrees / 45) % 8;


  return directions[index];

}


/* ============================================================
   GAUGE DE TEMPERATURA
   ============================================================ */

function setGauge(temperature) {

  if (!gaugeFillEl) {
    return;
  }


  const clamped =
    Math.min(
      Math.max(
        temperature,
        GAUGE_MIN
      ),
      GAUGE_MAX
    );


  const ratio =
    (clamped - GAUGE_MIN) /
    (GAUGE_MAX - GAUGE_MIN);


  const offset =
    GAUGE_CIRCUMFERENCE *
    (1 - ratio);


  requestAnimationFrame(() => {

    gaugeFillEl.style.strokeDashoffset =
      `${offset}`;

  });

}


/* ============================================================
   DATA E HORA
   ============================================================ */

function formatConsultationDate(dateString) {

  if (!dateString) {
    return "Data indisponível";
  }


  const date =
    new Date(dateString);


  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }


  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  ).format(date);

}


/* ============================================================
   NOME DO DIA DA SEMANA (CURTO), PARA A PREVISÃO
   ============================================================ */

function formatForecastDayLabel(dateString, index) {

  if (index === 0) {
    return "Hoje";
  }


  const date =
    new Date(`${dateString}T00:00:00`);


  if (Number.isNaN(date.getTime())) {
    return "—";
  }


  const label =
    new Intl.DateTimeFormat(
      "pt-BR",
      { weekday: "short" }
    ).format(date);


  /* Remove o ponto final (ex.: "seg." -> "seg") e capitaliza */

  const clean =
    label.replace(".", "");


  return (
    clean.charAt(0).toUpperCase() +
    clean.slice(1)
  );

}


/* ============================================================
   TEMA DIA / NOITE
   ============================================================ */

function updateTheme(isDay) {

  document.body.classList.toggle(
    "day",
    isDay
  );

  document.body.classList.toggle(
    "night",
    !isDay
  );

}


/* ============================================================
   ÍCONE DO CLIMA
   ============================================================ */

function getWeatherIconClass(weatherCode, isDay) {

  const weatherInfo =
    WEATHER_CODES[weatherCode];


  if (!weatherInfo) {
    return "wi-na";
  }


  if (isDay) {
    return weatherInfo.dayIcon;
  }


  return (
    weatherInfo.nightIcon ||
    weatherInfo.dayIcon
  );

}


function updateWeatherIcon(weatherCode, isDay) {

  const iconClass =
    getWeatherIconClass(
      weatherCode,
      isDay
    );


  conditionIconEl.className =
    `condition__icon wi ${iconClass}`;

}


/* ============================================================
   RENDERIZA O CLIMA NA TELA
   ============================================================ */

function renderWeather(place, current) {

  const weatherInfo =
    WEATHER_CODES[current.weather_code] || {

      text: "Condição desconhecida",

      dayIcon: "wi-na",

      nightIcon: "wi-na"

    };


  /* Cidade */

  cityNameEl.textContent =
    place.name || "Cidade desconhecida";


  /* Estado / região + país */

  const locationParts = [];


  if (place.admin1) {
    locationParts.push(place.admin1);
  }


  if (place.country) {
    locationParts.push(place.country);
  }


  cityMetaEl.textContent =
    locationParts.join(" · ");


  /* Temperatura */

  const temperature =
    Number(current.temperature_2m);


  temperatureEl.textContent =
    Math.round(temperature);


  setGauge(temperature);


  /* Dia ou noite */

  const isDay =
    Number(current.is_day) === 1;


  updateTheme(isDay);


  /* Ícone */

  updateWeatherIcon(
    current.weather_code,
    isDay
  );


  /* Descrição */

  conditionTextEl.textContent =
    weatherInfo.text;


  /* Sensação térmica */

  if (
    current.apparent_temperature !== undefined &&
    current.apparent_temperature !== null
  ) {

    feelsLikeEl.textContent =
      `Sensação térmica: ${Math.round(
        current.apparent_temperature
      )}°C`;

  } else {

    feelsLikeEl.textContent = "";

  }


  /* Umidade */

  if (
    current.relative_humidity_2m !== undefined
  ) {

    humidityEl.textContent =
      `${Math.round(
        current.relative_humidity_2m
      )}%`;

  } else {

    humidityEl.textContent = "—";

  }


  /* Vento */

  if (
    current.wind_speed_10m !== undefined
  ) {

    windEl.textContent =
      `${Math.round(
        current.wind_speed_10m
      )} km/h`;

  } else {

    windEl.textContent = "—";

  }


  /* Direção */

  windDirEl.textContent =
    degreesToCompass(
      current.wind_direction_10m
    );


  /* Coordenadas */

  if (
    typeof place.latitude === "number" &&
    typeof place.longitude === "number"
  ) {

    coordsEl.textContent =
      `${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}`;

  } else {

    coordsEl.textContent = "—";

  }


  /* Data e hora */

  consultationDateEl.textContent =
    formatConsultationDate(
      current.time
    );


  /* Mostra resultado */

  resultEl.hidden = false;

}


/* ============================================================
   RENDERIZA A PREVISÃO DE 5 DIAS
   ============================================================ */

function renderForecast(daily) {

  if (!forecastListEl) {
    return;
  }


  forecastListEl.innerHTML = "";


  const {
    time = [],
    weather_code: weatherCodes = [],
    temperature_2m_max: maxTemps = [],
    temperature_2m_min: minTemps = []
  } = daily;


  time.forEach((dateString, index) => {

    const li =
      document.createElement("li");

    li.className = "forecast__day";


    /* Dia da semana */

    const dayNameEl =
      document.createElement("span");

    dayNameEl.className =
      "forecast__day-name";

    dayNameEl.textContent =
      formatForecastDayLabel(
        dateString,
        index
      );


    /* Ícone (assume período diurno para a previsão) */

    const iconEl =
      document.createElement("span");

    iconEl.className =
      `forecast__day-icon wi ${getWeatherIconClass(
        weatherCodes[index],
        true
      )}`;

    iconEl.setAttribute(
      "aria-hidden",
      "true"
    );


    /* Temperaturas máxima e mínima */

    const tempsEl =
      document.createElement("div");

    tempsEl.className =
      "forecast__day-temps";


    const maxEl =
      document.createElement("span");

    maxEl.className =
      "forecast__day-max";

    const maxValue =
      maxTemps[index];

    maxEl.textContent =
      maxValue !== undefined &&
      maxValue !== null
        ? `${Math.round(maxValue)}°`
        : "—";


    const minEl =
      document.createElement("span");

    minEl.className =
      "forecast__day-min";

    const minValue =
      minTemps[index];

    minEl.textContent =
      minValue !== undefined &&
      minValue !== null
        ? `${Math.round(minValue)}°`
        : "—";


    tempsEl.appendChild(maxEl);
    tempsEl.appendChild(minEl);


    li.appendChild(dayNameEl);
    li.appendChild(iconEl);
    li.appendChild(tempsEl);


    forecastListEl.appendChild(li);

  });

}


/* ============================================================
   GEOCODIFICAÇÃO
   Nome da cidade -> Latitude / Longitude
   ============================================================ */

async function geocodeCity(cityName) {

  const url =
    new URL(GEOCODING_URL);


  url.searchParams.set(
    "name",
    cityName
  );


  url.searchParams.set(
    "count",
    "1"
  );


  url.searchParams.set(
    "language",
    "pt"
  );


  url.searchParams.set(
    "format",
    "json"
  );


  let response;


  try {

    response =
      await fetch(url);

  } catch (error) {

    throw new Error(
      "Não foi possível conectar ao serviço de cidades. Verifique sua internet."
    );

  }


  if (!response.ok) {

    throw new Error(
      "O serviço de busca de cidades está indisponível no momento."
    );

  }


  let data;


  try {

    data =
      await response.json();

  } catch (error) {

    throw new Error(
      "A API retornou uma resposta inválida."
    );

  }


  if (
    !data.results ||
    data.results.length === 0
  ) {

    throw new Error(
      `A cidade "${cityName}" não foi encontrada.`
    );

  }


  return data.results[0];

}


/* ============================================================
   CONSULTA O CLIMA ATUAL
   Latitude / Longitude -> clima atual
   ============================================================ */

async function fetchCurrentWeather(
  latitude,
  longitude
) {

  const url =
    new URL(FORECAST_URL);


  url.searchParams.set(
    "latitude",
    latitude
  );


  url.searchParams.set(
    "longitude",
    longitude
  );


  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "is_day"
    ].join(",")
  );


  url.searchParams.set(
    "timezone",
    "auto"
  );


  let response;


  try {

    response =
      await fetch(url);

  } catch (error) {

    throw new Error(
      "Erro de rede. Verifique sua conexão com a internet."
    );

  }


  if (!response.ok) {

    throw new Error(
      "Não foi possível consultar o clima. A API pode estar indisponível."
    );

  }


  let data;


  try {

    data =
      await response.json();

  } catch (error) {

    throw new Error(
      "A API de clima retornou uma resposta inválida."
    );

  }


  if (!data.current) {

    throw new Error(
      "A resposta da API não trouxe os dados do clima atual."
    );

  }


  return data.current;

}


/* ============================================================
   CONSULTA A PREVISÃO DE 5 DIAS
   Latitude / Longitude -> previsão diária (máx / mín)
   ============================================================ */

async function fetchForecast(
  latitude,
  longitude
) {

  const url =
    new URL(FORECAST_URL);


  url.searchParams.set(
    "latitude",
    latitude
  );


  url.searchParams.set(
    "longitude",
    longitude
  );


  url.searchParams.set(
    "daily",
    [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min"
    ].join(",")
  );


  url.searchParams.set(
    "forecast_days",
    String(FORECAST_DAYS)
  );


  url.searchParams.set(
    "timezone",
    "auto"
  );


  let response;


  try {

    response =
      await fetch(url);

  } catch (error) {

    throw new Error(
      "Erro de rede ao buscar a previsão. Verifique sua conexão com a internet."
    );

  }


  if (!response.ok) {

    throw new Error(
      "Não foi possível consultar a previsão de 5 dias. A API pode estar indisponível."
    );

  }


  let data;


  try {

    data =
      await response.json();

  } catch (error) {

    throw new Error(
      "A API de previsão retornou uma resposta inválida."
    );

  }


  if (!data.daily) {

    throw new Error(
      "A resposta da API não trouxe os dados da previsão de 5 dias."
    );

  }


  return data.daily;

}


/* ============================================================
   FLUXO PRINCIPAL
   ============================================================ */

async function handleSearch(event) {

  event.preventDefault();


  const city =
    cityInput.value.trim();


  /* Campo vazio */

  if (!city) {

    showStatus(
      "Digite o nome de uma cidade.",
      "error"
    );

    cityInput.focus();

    return;

  }


  /* Esconde resultado anterior */

  resultEl.hidden = true;


  /* Mostra carregamento */

  showStatus(
    `Localizando "${city}"...`
  );


  try {

    /* ----------------------------------------
       1. Buscar cidade
       ---------------------------------------- */

    const place =
      await geocodeCity(city);


    /* ----------------------------------------
       2. Buscar clima atual + previsão
          (em paralelo)
       ---------------------------------------- */

    showStatus(
      `Consultando clima em ${place.name}...`
    );


    const [current, daily] =
      await Promise.all([

        fetchCurrentWeather(
          place.latitude,
          place.longitude
        ),

        fetchForecast(
          place.latitude,
          place.longitude
        )

      ]);


    /* ----------------------------------------
       3. Exibir resultado
       ---------------------------------------- */

    hideStatus();


    renderWeather(
      place,
      current
    );


    renderForecast(daily);


  } catch (error) {

    resultEl.hidden = true;


    showStatus(
      error.message ||
      "Ocorreu um erro inesperado.",
      "error"
    );

  }

}


/* ============================================================
   EVENTO DO FORMULÁRIO
   ============================================================ */

if (form) {

  form.addEventListener(
    "submit",
    handleSearch
  );

}


/* ============================================================
   EXPORTAÇÃO PARA TESTES (Node/Jest)
   Não afeta a execução no navegador.
   ============================================================ */

if (
  typeof module !== "undefined" &&
  module.exports
) {

  module.exports = {
    geocodeCity,
    fetchCurrentWeather,
    fetchForecast,
    degreesToCompass,
    formatConsultationDate,
    formatForecastDayLabel,
    getWeatherIconClass,
    renderWeather,
    renderForecast,
    WEATHER_CODES,
    FORECAST_DAYS
  };

}


/* ============================================================
   LOG INICIAL
   ============================================================ */

console.log(
  "Estação. carregada com sucesso."
);