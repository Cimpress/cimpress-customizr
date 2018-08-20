import CustomizrClient from './CustomizrClient';
import countryLanguage from 'country-language';

const mcpCustomizr = new CustomizrClient({
    resource: 'mcp-generic-ui-settings',
});

async function getMcpSettings(accessToken) {
    return await mcpCustomizr.getSettings(accessToken);
}

async function putMcpSettings(accessToken, settings) {
    mcpCustomizr.putSettings(accessToken, {
        language: settings.language,
        regionalSettings: settings.regionalSettings,
    });
}

async function getPreferredMcpLanguages(accessToken) {
    const mcpSettings = await mcpCustomizr.getSettings(accessToken);
    const twoLetterArray = mcpSettings.language;

    return twoLetterArray.map((twoLetter) => {
        let language = countryLanguage.getLanguages().find((a) => a.iso639_1 === twoLetter);
        return {
            lang: twoLetter,
            iso639_1: language ? language.iso639_1 : twoLetter,
            iso639_2: language ? language.iso639_2 : undefined,
            iso639_3: language ? language.iso639_3 : undefined,
        };
    });
}

async function setPreferredMcpLanguage(accessToken, languageCode) {
    let language = countryLanguage.getLanguages()
        .find((a) => (a.iso639_1 && a.iso639_1 === languageCode)
            || (a.iso639_2 && a.iso639_2 === languageCode)
            || (a.iso639_3 && a.iso639_3 === languageCode));

    if (!language) {
        throw new Error('Provided language code is not valid. Please pass valid ISO-639 code');
    }

    let currentLanguages = await getPreferredMcpLanguages(accessToken);
    let newLanguages = [language.iso639_1].concat(currentLanguages.filter((a) => a !== language.iso639_1));

    mcpCustomizr.putSettings(accessToken, {
        language: newLanguages,
    });
}

async function getMcpRegionalSettings(accessToken) {
    const mcpSettings = await mcpCustomizr.getSettings(accessToken);
    return mcpSettings.language;
}

async function putMcpRegionalSettings(accessToken, regionalSettings) {
    mcpCustomizr.putSettings(accessToken, {
        regionalSettings: regionalSettings,
    });
}

export {
    getMcpSettings,
    putMcpSettings,
    getPreferredMcpLanguages,
    setPreferredMcpLanguage,
    getMcpRegionalSettings,
    putMcpRegionalSettings,
};
