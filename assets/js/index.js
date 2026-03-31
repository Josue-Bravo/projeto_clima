/**
 * @overview Previsão do Tempo
 *
 * Aplicação web de consulta meteorológica construída com HTML, CSS e
 * JavaScript puro, sem frameworks ou bibliotecas adicionais.
 *
 * ### Funcionalidades
 * - Busca de cidade por nome com validação de entrada
 * - Conversão automática de nome para coordenadas geográficas
 * - Exibição de temperatura atual, vento e umidade
 * - Previsão dos próximos 6 dias com ícone e descrição
 * - Temas visuais dinâmicos baseados no clima e na temperatura
 * - Spinner de carregamento e mensagens de erro tratadas
 * - Layout responsivo compatível com desktop e mobile
 * - Suporte a busca via teclado (Enter)
 *
 * ### APIs utilizadas
 * - {@link https://open-meteo.com/en/docs/geocoding-api Open-Meteo Geocoding API}
 * - {@link https://open-meteo.com/en/docs Open-Meteo Weather API}
 *
 * @module index
 */

/**
 * ### Dependências de desenvolvimento
 * - `jest@^29` — framework de testes unitários
 * - `jsdoc@^4` — geração de documentação
 *
 * Nenhuma dependência de produção — o frontend roda com JavaScript puro.
 */

/**
 * ### Licença
 * Este projeto está licenciado sob a {@link https://opensource.org/licenses/MIT MIT License}.
 *
 * ### Atribuições
 * Dados meteorológicos fornecidos por {@link https://open-meteo.com Open-Meteo},
 * licenciados sob {@link https://creativecommons.org/licenses/by/4.0/ CC BY 4.0}.
 */