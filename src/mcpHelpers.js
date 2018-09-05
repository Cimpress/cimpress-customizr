import CustomizrClient from './CustomizrClient';
import countryLanguage from 'country-language';
import IANATimezoneData from 'iana-tz-data';
import LanguageTag from 'rfc5646';

const mcpCustomizr = new CustomizrClient({
    resource: 'mcp-generic-ui-settings',
});

const validTimezones = [];
const regions = Object.keys(IANATimezoneData.zoneData);
regions.forEach((region) => {
    Object.keys(IANATimezoneData.zoneData[region])
        .forEach((city) => {
            validTimezones.push(`${region}/${city}`);
        });
});

async function getMcpSettings(accessToken) {
    return await mcpCustomizr.getSettings(accessToken);
}

async function setMcpSettings(accessToken, settings) {
    mcpCustomizr.putSettings(accessToken, {
        language: settings.language,
        regionalSettings: settings.regionalSettings,
        timezone: settings.timezone,
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
        throw new Error('Provided language code is not valid. Please pass a valid ISO-639 code');
    }

    let currentLanguages = await getPreferredMcpLanguages(accessToken);
    let newLanguages = [language.iso639_1].concat(currentLanguages.filter((a) => a !== language.iso639_1));

    mcpCustomizr.putSettings(accessToken, {
        language: newLanguages,
    });
}

async function getPreferredMcpRegionalSettings(accessToken) {
    const mcpSettings = await mcpCustomizr.getSettings(accessToken);
    return mcpSettings.regionalSettings;
}

async function setPreferredMcpRegionalSettings(accessToken, languageTag) {
    let valid = false;
    let rfcCompliantValue;
    try {
        let tag = new LanguageTag(languageTag);
        valid = !!tag.language;
        rfcCompliantValue = tag.truncate({script: false}).toString();
    } catch (e) {
        valid = false;
    }
    if (!valid) {
        throw new Error('Expected a valid rfc5646 language tag (eg. "en", "en-US", ...)');
    }

    mcpCustomizr.putSettings(accessToken, {
        regionalSettings: rfcCompliantValue,
    });
}

async function getPreferredMcpTimezone(accessToken) {
    const mcpSettings = await mcpCustomizr.getSettings(accessToken);
    return mcpSettings.timezone;
}

async function setPreferredMcpTimezone(accessToken, timezone) {
    let tz = validTimezones.find((t) => t === timezone);
    if (!tz) {
        throw new Error('Provided timezone is not valid. Please pass valid IANA timezone identifier, eg. Europe/Amsterdam');
    }

    mcpCustomizr.putSettings(accessToken, {
        timezone: timezone,
    });
}

export {
    getMcpSettings,
    setMcpSettings,
    getPreferredMcpLanguages,
    setPreferredMcpLanguage,
    getPreferredMcpRegionalSettings,
    setPreferredMcpRegionalSettings,
    getPreferredMcpTimezone,
    setPreferredMcpTimezone,
};
