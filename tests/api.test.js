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

/**
 * Mock global da Fetch API.
 * Substitui o `fetch` nativo por uma função controlada pelo Jest,
 * permitindo simular respostas sem realizar requisições reais.
 *
 * @type {jest.Mock}
 */
global.fetch = jest.fn();

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
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    results: [{ name: 'São Paulo', latitude: -23.55, longitude: -46.63 }]
                })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    current_weather: { temperature: 25, windspeed: 10, weathercode: 0 },
                    hourly: { relativehumidity_2m: [80] },
                    daily: {
                        time: ['2025-01-01'],
                        weathercode: [0],
                        temperature_2m_max: [28],
                        temperature_2m_min: [18]
                    }
                })
            });

        const coords = await fetchCoordinates('São Paulo');
        expect(coords.name).toBe('São Paulo');
        expect(coords.latitude).toBe(-23.55);

        const weather = await fetchWeather(coords.latitude, coords.longitude);
        expect(weather.current_weather.temperature).toBe(25);
    });

    /**
     * Verifica se uma cidade inexistente resulta em erro com
     * mensagem adequada ao usuário.
     * Simula a API retornando uma lista de resultados vazia.
     */
    test('cidade inexistente lança erro com mensagem adequada', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ results: [] })
        });

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
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({})
        });

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
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 429,
            json: async () => ({})
        });

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
     * Verifica se uma resposta com estrutura JSON inesperada
     * é tratada como "cidade não encontrada" em vez de causar
     * um erro de propriedade undefined.
     * Simula mudança de contrato na API (ex: `results` renomeado para `resultados`).
     */
    test('resposta sem current_weather lança erro', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ resultados: [] })
        });

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
        const info = getWeatherInfo(9999);
        expect(info).toEqual(weatherCodes[0]);
    });

});