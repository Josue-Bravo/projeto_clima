/**
 * @fileoverview Módulo principal de interface do usuário.
 * Parte da aplicação de Previsão do Tempo — conecta os dados
 * retornados pela API com os elementos visuais da página,
 * gerenciando eventos, temas dinâmicos e navegação entre telas.
 *
 * @module script
 * @requires module:api
 */

import { validateCity, fetchCoordinates, fetchWeather, getTempTheme, getWeatherInfo } from './api.js';

// ===== CONSTANTES =====

/**
 * Lista de todos os temas de clima disponíveis.
 * Usada para limpar classes anteriores antes de aplicar o novo tema.
 * @constant {string[]}
 */
const WEATHER_THEMES = ['sunny', 'cloudy', 'rainy', 'storm'];

/**
 * Lista de todos os temas de temperatura disponíveis.
 * Usada para limpar classes anteriores antes de aplicar o novo tema.
 * @constant {string[]}
 */
const TEMP_THEMES = ['cold', 'mild', 'warm', 'hot'];

/**
 * Nomes abreviados dos dias da semana em português.
 * O índice corresponde ao retorno de `Date.getDay()` (0 = Domingo).
 * @constant {string[]}
 */
const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// ===== ELEMENTOS DO DOM =====

/** 
 * Campo de texto para o nome da cidade
 * @type {HTMLInputElement}
 */
const cityInput = document.getElementById('cityInput');

/** 
 * Botão que dispara a busca. 
 * @type {HTMLButtonElement} 
 */
const searchBtn = document.getElementById('searchBtn');

/** 
 * Seção de resultado ocultada até a busca ser concluída. 
 * @type {HTMLElement} 
 */
const resultSection = document.getElementById('result');

/** 
 * Elemento que exibe o nome da cidade encontrada.
 * @type {HTMLElement}  
 */
const cityName = document.getElementById('cityName');

/** 
 * Elemento que exibe a temperatura atual.
 * @type {HTMLElement}
  */
const temperature = document.getElementById('temperature');

/** 
 * Elemento que exibe mensagens de erro ao usuário.
 * @type {HTMLElement}
  */
const errorMsg = document.getElementById('errorMsg');

/** 
 * Spinner de carregamento exibido durante as requisições.
 * @type {HTMLElement}
 */
const spinner = document.getElementById('spinner');

/** 
 * Botão que retorna à tela de busca.
 * @type {HTMLButtonElement}
 */
const backBtn = document.getElementById('backBtn');

/** 
 * Seção de busca ocultada ao exibir o resultado. 
 * @type {HTMLElement}
 */
const searchSection = document.querySelector('.card__search');

/** 
 * Elemento que exibe a velocidade do vento. 
 * @type {HTMLElement}
 */
const windspeedEl = document.getElementById('windspeed');

/** 
 * Elemento que exibe a umidade relativa do ar.
 * @type {HTMLElement}
 */
const humidityEl = document.getElementById('humidity');

/** 
 * Figure que recebe a imagem do ícone do clima atual. 
 * @type {HTMLElement}
 */
const weatherIcon = document.getElementById('weatherIcon');

/** 
 * Elemento que exibe o label textual do clima atual.
 * @type {HTMLElement}
 */
const weatherLabel = document.getElementById('weatherLabel');

/** 
 * Lista que recebe os itens da previsão dos próximos dias.
 * @type {HTMLUListElement}
 */
const forecast = document.getElementById('forecast');

// ===== EVENTOS =====

backBtn.addEventListener('click', () => {
    showSearch();
    cityInput.value = '';
    clearError();
});

searchBtn.addEventListener('click', async () => {
    try {
        const city = validateCity(cityInput.value);
        clearError();
        setLoading(true);

        const locationData = await fetchCoordinates(city);

        const { latitude, longitude } = locationData;

        const data = await fetchWeather(latitude, longitude);

        const formattedName = formatLocationName(locationData);

        updateUI(data, formattedName);

    } catch (err) {
        showError(err.message);
    } finally {
        setLoading(false);
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchBtn.click();
});

// ===== LOADING =====

/**
 * Ativa ou desativa o estado de carregamento da interface.
 * Desabilita os controles de entrada e exibe o spinner enquanto
 * as requisições estão em andamento.
 *
 * @param {boolean} isLoading - `true` para ativar o loading, `false` para desativar.
 * @returns {void}
 *
 * @example
 * setLoading(true);  // desabilita input/botão e exibe spinner
 * setLoading(false); // reabilita input/botão e oculta spinner
 */
function setLoading(isLoading) {
    searchBtn.disabled = isLoading;
    cityInput.disabled = isLoading;
    spinner.classList.toggle('hidden', !isLoading);
}

// ===== RENDERIZAÇÃO =====

/**
 * Atualiza todos os elementos visuais do card de resultado
 * com os dados meteorológicos recebidos da API.
 *
 * Orquestra a atualização de: nome da cidade, temperatura, vento,
 * umidade, ícone do clima, temas visuais e previsão dos próximos dias.
 *
 * @param {Object} data - Objeto de dados meteorológicos retornado por `fetchWeather`.
 * @param {Object} data.current_weather - Dados do clima atual.
 * @param {number} data.current_weather.temperature - Temperatura atual em °C.
 * @param {number} data.current_weather.windspeed - Velocidade do vento em km/h.
 * @param {number} data.current_weather.weathercode - Código WMO do clima atual.
 * @param {Object} data.hourly - Dados horários.
 * @param {number[]} data.hourly.relativehumidity_2m - Umidade relativa por hora (%).
 * @param {Object} data.daily - Dados diários para previsão.
 * @param {string} name - Nome da cidade a ser exibido.
 * @returns {void}
 *
 * @example
 * const data = await fetchWeather(-23.55, -46.63);
 * updateUI(data, 'São Paulo');
 */
function updateUI(data, name) {
    const { temperature: currentTemp, windspeed, weathercode } = data.current_weather;
    const currentHumidity = data.hourly.relativehumidity_2m[0];

    cityName.textContent = name;
    temperature.textContent = `${currentTemp}°C`;
    windspeedEl.textContent = `${windspeed} km/h`;
    humidityEl.textContent = `${currentHumidity}%`;

    const weather = getWeatherInfo(weathercode);
    const img = document.createElement('img');
    img.src = `./assets/icons/weather/${weather.icon}`;
    img.alt = weather.label;
    img.classList.add('weather-icon');

    weatherIcon.innerHTML = '';
    weatherIcon.appendChild(img);

    applyWeatherTheme(weathercode);
    applyTempTheme(currentTemp);
    renderForecast(data.daily);
    showResult();
}

/**
 * Formata o nome de exibição de uma localização retornada pela API de Geocoding.
 * Adapta o formato conforme o tipo de lugar: cidade, estado ou país.
 *
 * @param {Object} location - Objeto de localização retornado pela API.
 * @param {string} location.name - Nome do lugar.
 * @param {string} location.country - Nome do país.
 * @param {string} [location.admin1] - Nome do estado/província (opcional).
 * @returns {string} Nome formatado para exibição. Ex: "São Paulo, SP, Brazil"
 *
 * @example
 * formatLocationName({ name: 'Campinas', admin1: 'São Paulo', country: 'Brazil' });
 * // 'Campinas, SP, Brazil'
 *
 * formatLocationName({ name: 'Rio de Janeiro', admin1: 'Rio de Janeiro', country: 'Brazil' });
 * // 'Rio de Janeiro, RJ, Brazil'
 *
 * formatLocationName({ name: 'Brazil', country: 'Brazil' });
 * // 'Brazil'
 */
function formatLocationName({ name, country, admin1 }) {
    if (name.toLowerCase() === country?.toLowerCase()) return name;
    if (!admin1) return `${name}, ${country}`;

    const stateCode = getStateCode(admin1, country);
    const regionLabel = stateCode ?? (admin1.toLowerCase() !== name.toLowerCase() ? admin1 : null);

    return regionLabel
        ? `${name}, ${regionLabel}, ${country}`
        : `${name}, ${country}`;
}

/**
 * Retorna a sigla (UF) de um estado brasileiro dado o nome completo.
 * Retorna `null` para países estrangeiros ou estados não mapeados.
 *
 * @param {string|null} stateName - Nome completo do estado em português.
 * @param {string|null} country - Nome do país em inglês ou português.
 * @returns {string|null} Sigla do estado (ex: 'SP', 'RJ') ou `null` se não encontrado.
 *
 * @example
 * getStateCode('São Paulo', 'Brazil');    // 'SP'
 * getStateCode('California', 'US');       // null
 * getStateCode(null, 'Brazil');           // null
 */
function getStateCode(stateName, country) {
    if (!country || !stateName) return null;

    const normalizedCountry = country.toLowerCase();

    if (normalizedCountry !== 'brazil' && normalizedCountry !== 'brasil') {
        return null;
    }

    const states = {
        'acre': 'AC',
        'alagoas': 'AL',
        'amapá': 'AP',
        'amazonas': 'AM',
        'bahia': 'BA',
        'ceará': 'CE',
        'distrito federal': 'DF',
        'espírito santo': 'ES',
        'goiás': 'GO',
        'maranhão': 'MA',
        'mato grosso': 'MT',
        'mato grosso do sul': 'MS',
        'minas gerais': 'MG',
        'pará': 'PA',
        'paraíba': 'PB',
        'paraná': 'PR',
        'pernambuco': 'PE',
        'piauí': 'PI',
        'rio de janeiro': 'RJ',
        'rio grande do norte': 'RN',
        'rio grande do sul': 'RS',
        'rondônia': 'RO',
        'roraima': 'RR',
        'santa catarina': 'SC',
        'são paulo': 'SP',
        'sergipe': 'SE',
        'tocantins': 'TO'
    };

    return states[stateName.toLowerCase()] || null;
}

/**
 * Gera e injeta o HTML da previsão dos próximos 6 dias na lista do DOM.
 * O primeiro item sempre exibe "Amanhã" em vez do nome do dia.
 * O item de amanhã recebe a classe `forecast__item--tomorrow` para destaque visual.
 *
 * @param {Object} daily - Objeto de dados diários retornado pela API.
 * @param {string[]} daily.time - Array de datas no formato `'YYYY-MM-DD'`.
 * @param {number[]} daily.weathercode - Códigos WMO para cada dia.
 * @param {number[]} daily.temperature_2m_max - Temperaturas máximas em °C.
 * @param {number[]} daily.temperature_2m_min - Temperaturas mínimas em °C.
 * @returns {void}
 *
 * @example
 * renderForecast(data.daily);
 * // Injeta 6 <li> na <ul id="forecast"> com ícone, dia e temperaturas
 */
function renderForecast(daily) {
    forecast.innerHTML = daily.time.slice(1).map((dateStr, i) => {
        const date = new Date(dateStr + 'T12:00:00');
        const dayName = i === 0 ? 'Amanhã' : WEEK_DAYS[date.getDay()];
        const weather = getWeatherInfo(daily.weathercode[i + 1]);
        const max = daily.temperature_2m_max[i + 1];
        const min = daily.temperature_2m_min[i + 1];

        return `
            <li class="forecast__item ${i === 0 ? 'forecast__item--tomorrow' : ''}">
              <div class="forecast__left">
                <span class="forecast__icon">
                  <img class="weather-icon" src="./assets/icons/weather/${weather.icon}" alt="${weather.label}" />
                </span>
                <div class="forecast__info">
                  <span class="forecast__day">${dayName}</span>
                  <span class="forecast__label">${weather.label}</span>
                </div>
              </div>
              <span class="forecast__temp">${max}°/${min}°</span>
            </li>
        `;
    }).join('');
}

// ===== TEMAS =====

/**
 * Aplica o tema visual de clima ao `<body>` com base no código meteorológico.
 * Remove todos os temas anteriores antes de aplicar o novo,
 * evitando acúmulo de classes.
 *
 * @param {number} weathercode - Código WMO do clima atual.
 * @returns {void}
 *
 * @example
 * applyWeatherTheme(61); // adiciona 'theme-rainy' ao body
 * applyWeatherTheme(0);  // adiciona 'theme-sunny' ao body
 */
function applyWeatherTheme(weathercode) {
    WEATHER_THEMES.forEach(t => document.body.classList.remove(`theme-${t}`));
    document.body.classList.add(`theme-${getWeatherInfo(weathercode).theme}`);
}

/**
 * Aplica o tema visual de temperatura ao `<body>` com base na temperatura atual.
 * Remove todos os temas anteriores antes de aplicar o novo,
 * evitando acúmulo de classes.
 *
 * @param {number} temp - Temperatura atual em graus Celsius.
 * @returns {void}
 *
 * @example
 * applyTempTheme(8);  // adiciona 'temp-cold' ao body
 * applyTempTheme(35); // adiciona 'temp-hot' ao body
 */
function applyTempTheme(temp) {
    TEMP_THEMES.forEach(t => document.body.classList.remove(`temp-${t}`));
    document.body.classList.add(`temp-${getTempTheme(temp)}`);
}

// ===== NAVEGAÇÃO =====

/**
 * Alterna a visibilidade entre dois elementos do DOM com animação de fade-in.
 * Oculta o elemento de origem e exibe o de destino.
 * O `void showEl.offsetWidth` força o reflow do browser para
 * reiniciar a animação CSS mesmo que a classe já estivesse presente.
 *
 * @param {HTMLElement} hideEl - Elemento a ser ocultado.
 * @param {HTMLElement} showEl - Elemento a ser exibido com fade-in.
 * @returns {void}
 *
 * @example
 * switchView(searchSection, resultSection); // exibe resultado
 * switchView(resultSection, searchSection); // volta para busca
 */
function switchView(hideEl, showEl) {
    hideEl.classList.add('hidden');
    showEl.classList.remove('fade-in');
    void showEl.offsetWidth;
    showEl.classList.remove('hidden');
    showEl.classList.add('fade-in');
}

/**
 * Exibe a seção de resultado e oculta a seção de busca.
 * Atalho semântico para `switchView(searchSection, resultSection)`.
 *
 * @returns {void}
 */
function showResult() {
    switchView(searchSection, resultSection);
}

/**
 * Exibe a seção de busca e oculta a seção de resultado.
 * Atalho semântico para `switchView(resultSection, searchSection)`.
 *
 * @returns {void}
 */
function showSearch() {
    switchView(resultSection, searchSection);
}

// ===== MENSAGENS =====

/**
 * Exibe uma mensagem de erro na interface e garante que
 * o resultado fique oculto e a busca fique visível.
 *
 * @param {string} msg - Mensagem de erro a ser exibida ao usuário.
 * @returns {void}
 *
 * @example
 * showError('Cidade não encontrada. Tente novamente.');
 */
function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
    resultSection.classList.add('hidden');
    searchSection.classList.remove('hidden');
}

/**
 * Limpa e oculta a mensagem de erro da interface.
 *
 * @returns {void}
 *
 * @example
 * clearError(); // limpa qualquer erro visível antes de nova busca
 */
function clearError() {
    errorMsg.textContent = '';
    errorMsg.classList.add('hidden');
}