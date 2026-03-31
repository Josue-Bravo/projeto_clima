/**
 * @fileoverview Testes unitários para o módulo api.js.
 * Cobre os cenários básicos de uso e casos extremos das funções
 * de validação, geocoding e busca meteorológica.
 *
 * @module api.test
 * @requires module:api
 *
 * @see {@link module:api} para a implementação testada.
 */

import { validateCity, fetchCoordinates, fetchWeather, getTempTheme, getWeatherInfo, weatherCodes } from '../assets/js/api.js';
import { jest } from '@jest/globals';

// ================================================================
// MOCKS E HELPERS
// ================================================================

/**
 * Mock global da Fetch API.
 * Substitui o `fetch` nativo por uma função controlada pelo Jest,
 * permitindo simular respostas sem realizar requisições reais.
 * @type {jest.Mock}
 */
global.fetch = jest.fn();

/**
 * Cria uma resposta mock bem-sucedida para o fetch.
 * Evita repetição de `{ ok: true, json: async () => ({...}) }` nos testes.
 *
 * @param {Object} body - Objeto que será retornado como JSON da resposta.
 * @returns {{ ok: boolean, json: Function }}
 *
 * @example
 * fetch.mockResolvedValueOnce(mockOkResponse({ results: [] }));
 */
const mockOkResponse = (body) => ({
    ok: true,
    json: async () => body,
});

/**
 * Cria uma resposta mock com falha HTTP.
 * @param {number} [status=500] - Código HTTP do erro.
 * @returns {{ ok: boolean, status: number, json: Function }}
 *
 * @example
 * fetch.mockResolvedValueOnce(mockErrorResponse(429));
 */
const mockErrorResponse = (status = 500) => ({
    ok: false,
    status,
    json: async () => ({}),
});

/**
 * Dados de coordenadas reutilizáveis nos testes.
 * @constant {{ saoPaulo: Object, manaus: Object }}
 */
const MOCK_COORDS = {
    saoPaulo: { name: 'São Paulo', latitude: -23.55, longitude: -46.63, admin1: 'São Paulo', country: 'Brazil' },
    manaus:   { name: 'Manaus',   latitude: -3.10,  longitude: -60.02, admin1: 'Amazonas',  country: 'Brazil' },
};

/**
 * Dados meteorológicos reutilizáveis nos testes.
 * @constant {Object}
 */
const MOCK_WEATHER = {
    current_weather: { temperature: 25, windspeed: 10, weathercode: 0 },
    hourly: { relativehumidity_2m: [80, 75, 70] },
    daily: {
        time: ['2025-01-01', '2025-01-02'],
        weathercode: [0, 61],
        temperature_2m_max: [28, 24],
        temperature_2m_min: [18, 16],
    },
};

/**
 * Limpa o histórico de chamadas do mock antes de cada teste,
 * garantindo que um teste não interfira no estado do próximo.
 */
beforeEach(() => {
    fetch.mockClear();
});

// ================================================================
// 3.6 TESTES BÁSICOS
// ================================================================

/**
 * @group Testes Básicos
 * Valida o comportamento esperado do fluxo principal da aplicação:
 * busca válida, cidade inexistente, entrada vazia e falha de API.
 */
describe('3.6 - Testes Básicos', () => {

    /**
     * Verifica se uma cidade válida retorna coordenadas corretas
     * e se os dados meteorológicos são recebidos com sucesso.
     * Simula duas respostas em sequência: geocoding e clima.
     */
    test('cidade válida retorna coordenadas e dados do clima', async () => {
        fetch
            .mockResolvedValueOnce(mockOkResponse({ results: [MOCK_COORDS.saoPaulo] }))
            .mockResolvedValueOnce(mockOkResponse(MOCK_WEATHER));

        const coords = await fetchCoordinates('São Paulo');
        expect(coords.name).toBe('São Paulo');
        expect(coords.latitude).toBe(-23.55);

        const data = await fetchWeather(coords.latitude, coords.longitude);
        expect(data.current_weather.temperature).toBe(25);
        expect(data.current_weather.windspeed).toBe(10);
        expect(data.daily.time).toHaveLength(2);
    });

    /**
     * Verifica se uma cidade inexistente resulta em erro com
     * mensagem adequada ao usuário.
     * Simula a API retornando uma lista de resultados vazia.
     */
    test('cidade inexistente lança erro com mensagem adequada', async () => {
        fetch.mockResolvedValueOnce(mockOkResponse({ results: [] }));

        await expect(fetchCoordinates('xyzabcqwerty'))
            .rejects
            .toThrow('Cidade não encontrada. Tente novamente.');
    });

    /**
     * Verifica se entradas inválidas — string vazia, só espaços e null —
     * são rejeitadas antes de qualquer requisição à API.
     */
    test('entrada vazia lança erro de validação', () => {
        expect(() => validateCity('')).toThrow('Digite o nome de uma cidade.');
        expect(() => validateCity('   ')).toThrow('Digite o nome de uma cidade.');
        expect(() => validateCity(null)).toThrow('Digite o nome de uma cidade.');
    });

    /**
     * Verifica se uma resposta HTTP não-ok (ex: status 500)
     * é tratada corretamente, lançando erro em vez de tentar
     * processar uma resposta inválida.
     */
    test('resposta não-ok da API lança erro', async () => {
        fetch.mockResolvedValueOnce(mockErrorResponse(500));

        await expect(fetchCoordinates('São Paulo'))
            .rejects
            .toThrow('Erro na requisição de coordenadas.');
    });

});

// ================================================================
// 3.7 CASOS EXTREMOS
// ================================================================

/**
 * @group Casos Extremos
 * Valida o comportamento da aplicação em situações adversas:
 * limite de requisições, falha de rede e formato inesperado de JSON.
 */
describe('3.7 - Casos Extremos', () => {

    /**
     * Verifica se o status 429 (Too Many Requests) é tratado
     * corretamente como erro de requisição, sem causar crash.
     */
    test('status 429 lança erro de requisição', async () => {
        fetch.mockResolvedValueOnce(mockErrorResponse(429));

        await expect(fetchCoordinates('São Paulo'))
            .rejects
            .toThrow('Erro na requisição de coordenadas.');
    });

    /**
     * Verifica se uma falha completa de rede — onde o fetch rejeita
     * a Promise em vez de retornar uma resposta — propaga o erro corretamente.
     * Simula perda de conexão ou timeout de rede.
     */
    test('falha de rede lança exceção', async () => {
        fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

        await expect(fetchCoordinates('São Paulo'))
            .rejects
            .toThrow('Failed to fetch');
    });

    /**
     * Verifica se uma resposta com estrutura JSON inesperada no geocoding
     * é tratada como "cidade não encontrada" em vez de causar
     * um erro de propriedade undefined.
     * Simula mudança de contrato na API (ex: `results` renomeado para `resultados`).
     */
    test('resposta com formato JSON inesperado no geocoding lança erro', async () => {
        fetch.mockResolvedValueOnce(mockOkResponse({ resultados: [] }));

        await expect(fetchCoordinates('São Paulo'))
            .rejects
            .toThrow('Cidade não encontrada. Tente novamente.');
    });

    /**
     * Verifica se `getTempTheme` classifica corretamente
     * cada faixa de temperatura nos seus respectivos temas visuais.
     */
    test('getTempTheme classifica temperaturas corretamente', () => {
        expect(getTempTheme(5)).toBe('cold');
        expect(getTempTheme(15)).toBe('mild');
        expect(getTempTheme(25)).toBe('warm');
        expect(getTempTheme(35)).toBe('hot');
    });

    /**
     * Verifica se `getWeatherInfo` retorna o fallback correto
     * quando recebe um código meteorológico não mapeado,
     * garantindo que a UI nunca fique sem ícone ou label.
     */
    test('getWeatherInfo usa fallback para weathercode desconhecido', () => {
        expect(getWeatherInfo(9999)).toEqual(weatherCodes[0]);
    });

});

// ================================================================
// 3.8 TESTES DE FETCHWEATHER
// ================================================================

/**
 * @group Testes de fetchWeather
 * Valida o comportamento específico da função de busca meteorológica,
 * incluindo respostas válidas, ausência de dados e falhas de rede.
 */
describe('3.8 - Testes de fetchWeather', () => {

    /**
     * Verifica se `fetchWeather` retorna corretamente todos os campos
     * esperados quando a API responde com sucesso.
     */
    test('retorna dados completos para coordenadas válidas', async () => {
        fetch.mockResolvedValueOnce(mockOkResponse(MOCK_WEATHER));

        const data = await fetchWeather(-3.10, -60.02);

        expect(data.current_weather.temperature).toBe(25);
        expect(data.current_weather.windspeed).toBe(10);
        expect(data.hourly.relativehumidity_2m).toHaveLength(3);
        expect(data.daily.time).toHaveLength(2);
    });

    /**
     * Verifica se `fetchWeather` lança erro quando a resposta
     * não contém o campo `current_weather`, indicando resposta
     * incompleta ou formato inesperado da API de clima.
     */
    test('resposta sem current_weather lança erro', async () => {
        fetch.mockResolvedValueOnce(mockOkResponse({
            hourly: { relativehumidity_2m: [80] },
        }));

        await expect(fetchWeather(-23.55, -46.63))
            .rejects
            .toThrow('Não foi possível obter o clima.');
    });

    /**
     * Verifica se `fetchWeather` lança erro quando a API
     * retorna status HTTP não-ok (ex: 500, 503).
     */
    test('resposta não-ok da API de clima lança erro', async () => {
        fetch.mockResolvedValueOnce(mockErrorResponse(500));

        await expect(fetchWeather(-23.55, -46.63))
            .rejects
            .toThrow('Erro na requisição do clima.');
    });

    /**
     * Verifica se `fetchWeather` propaga corretamente
     * erros de rede (ex: sem conexão, timeout).
     */
    test('falha de rede no clima lança exceção', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(fetchWeather(-23.55, -46.63))
            .rejects
            .toThrow('Network error');
    });

});

// ================================================================
// 3.9 TESTES DE VALIDATECITY
// ================================================================

/**
 * @group Testes de validateCity
 * Valida todos os cenários de entrada da função de validação,
 * incluindo entradas válidas, inválidas e casos extremos.
 */
describe('3.9 - Testes de validateCity', () => {

    /**
     * Verifica se `validateCity` retorna a cidade sem espaços
     * extras quando a entrada é válida.
     */
    test('cidade válida retorna string sem espaços nas extremidades', () => {
        expect(validateCity('São Paulo')).toBe('São Paulo');
        expect(validateCity('  Manaus  ')).toBe('Manaus');
        expect(validateCity('  Rio de Janeiro  ')).toBe('Rio de Janeiro');
    });

    /**
     * Verifica se `validateCity` não lança erro para entradas com números.
     * A validação cobre apenas presença — conteúdo inválido é tratado pela API.
     */
    test('entrada com apenas números não lança erro de validação', () => {
        expect(() => validateCity('123')).not.toThrow();
        expect(validateCity('123')).toBe('123');
    });

    /**
     * Verifica se `validateCity` rejeita todos os tipos
     * de entrada falsy: null, undefined, vazio, espaços, tab e newline.
     */
    test('todos os tipos de entrada falsy lançam erro', () => {
        const invalids = [null, undefined, '', '   ', '\t', '\n'];
        invalids.forEach(input => {
            expect(() => validateCity(input)).toThrow('Digite o nome de uma cidade.');
        });
    });

});

// ================================================================
// 3.10 TESTES DE GETWEATHERINFO E GETTEMPTHEME
// ================================================================

/**
 * @group Testes de getWeatherInfo e getTempTheme
 * Valida o mapeamento de códigos meteorológicos e classificação
 * de temperaturas, incluindo limites de faixa e casos extremos.
 */
describe('3.10 - Testes de getWeatherInfo e getTempTheme', () => {

    /**
     * Verifica se todos os temas de clima mapeados em `weatherCodes`
     * pertencem ao conjunto válido de temas da aplicação.
     */
    test('todos os weatherCodes mapeados possuem tema válido', () => {
        const validThemes = ['sunny', 'cloudy', 'rainy', 'storm'];

        Object.values(weatherCodes).forEach(info => {
            expect(validThemes).toContain(info.theme);
            expect(info.icon).toBeTruthy();
            expect(info.label).toBeTruthy();
        });
    });

    /**
     * Verifica se `getWeatherInfo` retorna os dados corretos
     * para códigos conhecidos representativos de cada tema.
     */
    test('getWeatherInfo retorna dados corretos para códigos conhecidos', () => {
        expect(getWeatherInfo(0).theme).toBe('sunny');
        expect(getWeatherInfo(3).theme).toBe('cloudy');
        expect(getWeatherInfo(61).theme).toBe('rainy');
        expect(getWeatherInfo(95).theme).toBe('storm');
    });

    /**
     * Verifica o comportamento de `getTempTheme` nos valores
     * exatos dos limites de cada faixa — os boundary values.
     * Esses são os pontos mais propensos a bugs de lógica.
     */
    test('getTempTheme nos limites exatos das faixas', () => {
        expect(getTempTheme(-50)).toBe('cold');
        expect(getTempTheme(9.9)).toBe('cold');
        expect(getTempTheme(10)).toBe('mild');
        expect(getTempTheme(19.9)).toBe('mild');
        expect(getTempTheme(20)).toBe('warm');
        expect(getTempTheme(29.9)).toBe('warm');
        expect(getTempTheme(30)).toBe('hot');
        expect(getTempTheme(60)).toBe('hot');
    });

    /**
     * Verifica se `getWeatherInfo` retorna o fallback para
     * múltiplos códigos inválidos, não apenas para 9999.
     */
    test('getWeatherInfo retorna fallback para qualquer código inválido', () => {
        const fallback = weatherCodes[0];
        [9999, -1, 100, NaN].forEach(code => {
            expect(getWeatherInfo(code)).toEqual(fallback);
        });
    });

});