import countryLanguage from 'country-language';
import IANATimezoneData from 'iana-tz-data';

const validTimezones = [];
const regions = Object.keys(IANATimezoneData.zoneData);
regions.forEach((region) => {
    Object.keys(IANATimezoneData.zoneData[region])
        .forEach((city) => {
            validTimezones.push(`${region}/${city}`);
        });
});

function getValidLanguageOrThrow(languageCode) {
    let language = countryLanguage.getLanguages()
        .find((a) => (a.iso639_1 && a.iso639_1 === languageCode)
            || (a.iso639_2 && a.iso639_2 === languageCode)
            || (a.iso639_3 && a.iso639_3 === languageCode));

    if (!language) {
        throw new Error('Provided language code is not valid. Please pass a valid ISO-639 code');
    }

    return language;
}

function getValidTimezoneOrThrow(timezone) {
    let tz = validTimezones.find((t) => t === timezone);
    if (!tz) {
        throw new Error('Provided timezone is not valid. Please pass valid IANA timezone identifier, eg. Europe/Amsterdam');
    }
    return tz;
}

function getValidLanguageTagOrThrow(languageTag) {
    // TODO
    return languageTag;
}

function updatePreferredLanguage(preferredLanguage, currentLanguages) {
    return [preferredLanguage.iso639_1].concat(currentLanguages.filter((a) => a !== preferredLanguage.iso639_1));
}


export {
    getValidLanguageOrThrow,
    getValidLanguageTagOrThrow,
    getValidTimezoneOrThrow,

    updatePreferredLanguage,
};
