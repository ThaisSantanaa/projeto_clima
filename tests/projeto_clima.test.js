/**
 * ============================================================
 * ESTAÇÃO. — Testes da API de clima (Open-Meteo)
 * ============================================================
 *
 * Antes de cada teste, o HTML real (index.html) é carregado no
 * DOM simulado (jsdom) e o módulo api.js é recarregado do zero.
 * Isso garante que os testes rodem contra a mesma estrutura de
 * elementos usada na página de verdade.
 */

const fs = require("fs");
const path = require("path");

const HTML_PATH = path.resolve(__dirname, "../index.html");
const html = fs.readFileSync(HTML_PATH, "utf8");

let api;

beforeEach(() => {
  jest.resetModules();
  document.documentElement.innerHTML = html;

  // Mock global do fetch antes de cada teste
  global.fetch = jest.fn();

  api = require("../api.js");
});

afterEach(() => {
  jest.restoreAllMocks();
});


/* ============================================================
   AUXILIARES
   ============================================================ */

function mockFetchOnce(ok, jsonData) {
  global.fetch.mockResolvedValueOnce({
    ok,
    json: async () => jsonData
  });
}


/* ============================================================
   degreesToCompass
   ============================================================ */

describe("degreesToCompass", () => {

  test("converte 0 graus para N", () => {
    expect(api.degreesToCompass(0)).toBe("N");
  });

  test("converte 90 graus para L (leste)", () => {
    expect(api.degreesToCompass(90)).toBe("L");
  });

  test("converte 180 graus para S", () => {
    expect(api.degreesToCompass(180)).toBe("S");
  });

  test("converte 270 graus para O", () => {
    expect(api.degreesToCompass(270)).toBe("O");
  });

  test("retorna travessão para valor indefinido", () => {
    expect(api.degreesToCompass(undefined)).toBe("—");
  });

  test("retorna travessão para NaN", () => {
    expect(api.degreesToCompass(NaN)).toBe("—");
  });

});


/* ============================================================
   geocodeCity
   ============================================================ */

describe("geocodeCity", () => {

  test("retorna o primeiro resultado em caso de sucesso", async () => {

    mockFetchOnce(true, {
      results: [
        { name: "São Paulo", latitude: -23.55, longitude: -46.63, country: "Brasil" }
      ]
    });

    const place = await api.geocodeCity("São Paulo");

    expect(place.name).toBe("São Paulo");
    expect(global.fetch).toHaveBeenCalledTimes(1);

  });

  test("lança erro quando a cidade não é encontrada", async () => {

    mockFetchOnce(true, { results: [] });

    await expect(
      api.geocodeCity("Cidade Inexistente")
    ).rejects.toThrow(/não foi encontrada/i);

  });

  test("lança erro quando a resposta HTTP não é ok", async () => {

    mockFetchOnce(false, {});

    await expect(
      api.geocodeCity("São Paulo")
    ).rejects.toThrow(/indisponível/i);

  });

  test("lança erro em falha de rede", async () => {

    global.fetch.mockRejectedValueOnce(new Error("network down"));

    await expect(
      api.geocodeCity("São Paulo")
    ).rejects.toThrow(/conectar/i);

  });

});


/* ============================================================
   fetchCurrentWeather
   ============================================================ */

describe("fetchCurrentWeather", () => {

  test("retorna os dados do clima atual em caso de sucesso", async () => {

    mockFetchOnce(true, {
      current: {
        temperature_2m: 24.3,
        weather_code: 1,
        is_day: 1
      }
    });

    const current = await api.fetchCurrentWeather(-23.55, -46.63);

    expect(current.temperature_2m).toBe(24.3);

  });

  test("lança erro quando a resposta não traz o campo 'current'", async () => {

    mockFetchOnce(true, {});

    await expect(
      api.fetchCurrentWeather(-23.55, -46.63)
    ).rejects.toThrow(/clima atual/i);

  });

  test("lança erro quando a resposta HTTP não é ok", async () => {

    mockFetchOnce(false, {});

    await expect(
      api.fetchCurrentWeather(-23.55, -46.63)
    ).rejects.toThrow(/indisponível/i);

  });

});


/* ============================================================
   fetchForecast (NOVO — previsão de 5 dias)
   ============================================================ */

describe("fetchForecast", () => {

  const dailyMock = {
    time: ["2026-08-16", "2026-08-17", "2026-08-18", "2026-08-19", "2026-08-20"],
    weather_code: [0, 1, 2, 61, 3],
    temperature_2m_max: [28, 27, 26, 22, 24],
    temperature_2m_min: [18, 17, 16, 15, 16]
  };

  test("solicita a previsão para 5 dias (forecast_days=5)", async () => {

    mockFetchOnce(true, { daily: dailyMock });

    await api.fetchForecast(-23.55, -46.63);

    const calledUrl = new URL(global.fetch.mock.calls[0][0]);

    expect(calledUrl.searchParams.get("forecast_days")).toBe("5");
    expect(calledUrl.searchParams.get("daily")).toContain("temperature_2m_max");
    expect(calledUrl.searchParams.get("daily")).toContain("temperature_2m_min");

  });

  test("retorna os dados diários em caso de sucesso", async () => {

    mockFetchOnce(true, { daily: dailyMock });

    const daily = await api.fetchForecast(-23.55, -46.63);

    expect(daily.time).toHaveLength(5);
    expect(daily.temperature_2m_max).toHaveLength(5);
    expect(daily.temperature_2m_min).toHaveLength(5);

  });

  test("lança erro quando a resposta não traz o campo 'daily'", async () => {

    mockFetchOnce(true, {});

    await expect(
      api.fetchForecast(-23.55, -46.63)
    ).rejects.toThrow(/previsão de 5 dias/i);

  });

  test("lança erro quando a resposta HTTP não é ok", async () => {

    mockFetchOnce(false, {});

    await expect(
      api.fetchForecast(-23.55, -46.63)
    ).rejects.toThrow(/indisponível/i);

  });

  test("lança erro em falha de rede", async () => {

    global.fetch.mockRejectedValueOnce(new Error("network down"));

    await expect(
      api.fetchForecast(-23.55, -46.63)
    ).rejects.toThrow(/Erro de rede/i);

  });

});


/* ============================================================
   renderForecast (NOVO — exibição de máx/mín na tela)
   ============================================================ */

describe("renderForecast", () => {

  test("renderiza um item por dia, na lista de previsão", () => {

    const daily = {
      time: ["2026-08-16", "2026-08-17", "2026-08-18", "2026-08-19", "2026-08-20"],
      weather_code: [0, 1, 2, 61, 3],
      temperature_2m_max: [28, 27, 26, 22, 24],
      temperature_2m_min: [18, 17, 16, 15, 16]
    };

    api.renderForecast(daily);

    const items = document.querySelectorAll("#forecastList .forecast__day");

    expect(items).toHaveLength(5);

  });

  test("exibe corretamente a temperatura máxima e mínima de cada dia", () => {

    const daily = {
      time: ["2026-08-16", "2026-08-17"],
      weather_code: [0, 1],
      temperature_2m_max: [28.6, 27.2],
      temperature_2m_min: [18.4, 17.9]
    };

    api.renderForecast(daily);

    const items = document.querySelectorAll("#forecastList .forecast__day");

    const firstMax = items[0].querySelector(".forecast__day-max").textContent;
    const firstMin = items[0].querySelector(".forecast__day-min").textContent;

    // Temperaturas são arredondadas para o inteiro mais próximo
    expect(firstMax).toBe("29°");
    expect(firstMin).toBe("18°");

  });

  test("marca o primeiro dia como 'Hoje'", () => {

    const daily = {
      time: ["2026-08-16", "2026-08-17"],
      weather_code: [0, 1],
      temperature_2m_max: [28, 27],
      temperature_2m_min: [18, 17]
    };

    api.renderForecast(daily);

    const firstDayName = document.querySelector(
      "#forecastList .forecast__day-name"
    ).textContent;

    expect(firstDayName).toBe("Hoje");

  });

  test("limpa a previsão anterior antes de renderizar a nova", () => {

    const daily = {
      time: ["2026-08-16", "2026-08-17", "2026-08-18", "2026-08-19", "2026-08-20"],
      weather_code: [0, 1, 2, 61, 3],
      temperature_2m_max: [28, 27, 26, 22, 24],
      temperature_2m_min: [18, 17, 16, 15, 16]
    };

    api.renderForecast(daily);
    api.renderForecast({
      time: ["2026-08-21"],
      weather_code: [0],
      temperature_2m_max: [30],
      temperature_2m_min: [20]
    });

    const items = document.querySelectorAll("#forecastList .forecast__day");

    expect(items).toHaveLength(1);

  });

});


/* ============================================================
   getWeatherIconClass
   ============================================================ */

describe("getWeatherIconClass", () => {

  test("retorna o ícone diurno para céu limpo durante o dia", () => {
    expect(api.getWeatherIconClass(0, true)).toBe("wi-day-sunny");
  });

  test("retorna o ícone noturno para céu limpo à noite", () => {
    expect(api.getWeatherIconClass(0, false)).toBe("wi-night-clear");
  });

  test("retorna 'wi-na' para código de clima desconhecido", () => {
    expect(api.getWeatherIconClass(9999, true)).toBe("wi-na");
  });

});


/* ============================================================
   formatForecastDayLabel
   ============================================================ */

describe("formatForecastDayLabel", () => {

  test("retorna 'Hoje' para o índice 0", () => {
    expect(
      api.formatForecastDayLabel("2026-08-16", 0)
    ).toBe("Hoje");
  });

  test("retorna um rótulo curto capitalizado para os demais dias", () => {

    const label = api.formatForecastDayLabel("2026-08-17", 1);

    expect(label.length).toBeGreaterThan(0);
    expect(label[0]).toBe(label[0].toUpperCase());

  });

});