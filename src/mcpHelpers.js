import CustomizrClient from './CustomizrClient';
import {countryLanguage} from './utils';

import {
    getValidLanguageOrThrow,
    getValidLanguageTagOrThrow,
    getValidTimezoneOrThrow,
    updatePreferredLanguage,
} from './utils';

const mcpCustomizr = new CustomizrClient({
    resource: 'mcp-generic-ui-settings',
});

/**
 * Return raw settings as stored in Customizr
 * @param {string} accessToken - Access token to use to call Customizr
 * @param {string} sessionId - Session Id to use to call Customizr
 * @return {Promise<*|void>}
 */
async function getMcpSettings(accessToken, sessionId = undefined) {
    let data = await mcpCustomizr.getSettings(accessToken, undefined, sessionId);
    if (Object.keys(data).length === 0) {
        return {
            language: ['en'],
            regionalSettings: 'en',
            timezone: 'America/New_York',
        };
    }
    return data;
}

/**
 * Set raw settings in Customizr without any validation
 * @param {string} accessToken - Access token to use to call Customizr
 * @param {object} settings - Settings object. Only language, regionalSettings and timezone will be read
 * @param {string} sessionId - Session Id to use to call Customizr
 * @return {Promise<void>}
 */
async function setMcpSettings(accessToken, settings, sessionId = undefined) {
    return await mcpCustomizr.putSettings(accessToken, {
        language: settings.language,
        regionalSettings: settings.regionalSettings,
        timezone: settings.timezone,
    }, undefined, sessionId);
}

/**
 * Validate and update the preferred user settings at once
 * @param {string} accessToken - Access token to use to call Customizr
 * @param {string} languageCode - ISO-639 language code (eg. bul, en, eng, de)
 * @param {string} languageTag - RFC 4656 compliant language code (eg. en, en-US)
 * @param {string} timezone - IANA timezone (eg. Europe/Amsterdam)
 * @param {string} sessionId - Session Id to use to call Customizr
 * @return {Promise<void>}
 */
async function setPreferredMcpSettings(accessToken, languageCode, languageTag, timezone, sessionId = undefined) {
    let preferredLanguage = getValidLanguageOrThrow(languageCode);
    let preferredRegionalSettings = getValidLanguageTagOrThrow(languageTag);
    let preferredTimezone = getValidTimezoneOrThrow(timezone);

    const mcpSettings = await getMcpSettings(accessToken, sessionId);

    return await mcpCustomizr.putSettings(accessToken, {
        language: updatePreferredLanguage(preferredLanguage, mcpSettings.language),
        regionalSettings: preferredRegionalSettings,
        timezone: preferredTimezone,
    }, undefined, sessionId);
}

/**
 * Get the preferred language from Customizr
 * @param {string} accessToken
 * @param {string} sessionId - Session Id to use to call Customizr
 * @return {Promise<*|Uint8Array|BigInt64Array|{lang: *, iso639_1: (string), iso639_2: *, iso639_3: *}[]|Float64Array|Int8Array|Float32Array|Int32Array|Uint32Array|Uint8ClampedArray|BigUint64Array|Int16Array|Uint16Array>}
 */
async function getPreferredMcpLanguages(accessToken, sessionId = undefined) {
    const mcpSettings = await getMcpSettings(accessToken, sessionId);
    const twoLetterArray = mcpSettings.language || [];

    return twoLetterArray.map((twoLetter) => {
        let language = countryLanguage.find((a) => a.iso639_1 === twoLetter);
        return {
            lang: twoLetter,
            iso639_1: language ? language.iso639_1 : twoLetter,
            iso639_2: language ? language.iso639_2 : undefined,
            iso639_3: language ? language.iso639_3 : undefined,
        };
    });
}

/**
 * Update the preferred language in Customizr
 * @param {string} accessToken - Access token to use to call Customizr
 * @param {string} languageCode - ISO-639 language code (eg. bul, en, eng, de)
 * @param {string} sessionId - Session Id to use to call Customizr
 * @return {Promise<void>}
 */
async function setPreferredMcpLanguage(accessToken, languageCode, sessionId = undefined) {
    let language = getValidLanguageOrThrow(languageCode);

    let currentLanguages = await getPreferredMcpLanguages(accessToken, sessionId);

    return mcpCustomizr.putSettings(accessToken, {
        language: updatePreferredLanguage(language, currentLanguages.map((l) => l.iso639_1)),
    }, undefined, sessionId);
}

/**
 * Get the preferred regional settings from Customizr
 * @param {string} accessToken - Access token to use to call Customizr
 * @param {string} sessionId - Session Id to use to call Customizr
 * @return {Promise<string>}
 */
async function getPreferredMcpRegionalSettings(accessToken, sessionId = undefined) {
    const mcpSettings = await mcpCustomizr.getSettings(accessToken, undefined, sessionId);
    return mcpSettings ? mcpSettings.regionalSettings : undefined;
}

/**
 * Update the preferred regional format in Customizr
 * @param {string} accessToken - Access token to use to call Customizr
 * @param {string} languageTag - RFC 4656 compliant language code (eg. en, en-US)
 * @param {string} sessionId - Session Id to use to call Customizr
 * @return {Promise<void>}
 */
async function setPreferredMcpRegionalSettings(accessToken, languageTag, sessionId = undefined) {
    let regionalSettings = getValidLanguageTagOrThrow(languageTag);

    return mcpCustomizr.putSettings(accessToken, {
        regionalSettings: regionalSettings,
    }.undefined, sessionId);
}

/**
 * Get the preferred timezone from Customizr
 * @param {string} accessToken - Access token to use to call Customizr
 * @param {string} sessionId - Session Id to use to call Customizr
 * @return {Promise<string>}
 */
async function getPreferredMcpTimezone(accessToken, sessionId = undefined) {
    const mcpSettings = await getMcpSettings(accessToken, sessionId);

    return mcpSettings.timezone;
}

/**
 * Update the preferred timezone from Customizr
 * @param {string} accessToken - Access token to use to call Customizr
 * @param {string} timezone - IANA timezone (eg. Europe/Amsterdam)
 * @param {string} sessionId - Session Id to use to call Customizr
 * @return {Promise<void>}
 */
async function setPreferredMcpTimezone(accessToken, timezone, sessionId = undefined) {
    let tz = getValidTimezoneOrThrow(timezone);

    return mcpCustomizr.putSettings(accessToken, {
        timezone: tz,
    }, undefined, sessionId);
}

export {
    getMcpSettings,
    setMcpSettings,

    setPreferredMcpSettings,
    getPreferredMcpLanguages,
    setPreferredMcpLanguage,
    getPreferredMcpRegionalSettings,
    setPreferredMcpRegionalSettings,
    getPreferredMcpTimezone,
    setPreferredMcpTimezone,
};
