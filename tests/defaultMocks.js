import nock from 'nock';

const resource = 'mcp-generic-ui-settings';

function defaultMocks() {
    nock.cleanAll();
    nock('https://customizr.at.cimpress.io')
        .get(`/v1/resources/${resource}/settings`)
        .reply(200, {
            language: defaultSettings.language.map((item) => item.lang),
            regionalSettings: defaultSettings.regionalSettings,
            timezone: defaultSettings.timezone,
        });

    nock('https://customizr.at.cimpress.io')
        .put(`/v1/resources/${resource}/settings`)
        .reply(200, {
            language: defaultSettings.language.map((item) => item.lang),
            regionalSettings: defaultSettings.regionalSettings,
            timezone: defaultSettings.timezone,
        });

    nock('https://sessions.cimpress.io')
        .post(`/v1/sessions/proxy?proxyUrl=https://customizr.at.cimpress.io/v1/resources/${resource}/settings&proxyUrlMethod=get`)
        .reply(200, {
            language: defaultSettings.language.map((item) => item.lang),
            regionalSettings: defaultSettings.regionalSettings,
            timezone: defaultSettings.timezone,
        });

    nock('https://sessions.cimpress.io')
        .post(`/v1/sessions/proxy?proxyUrl=https://customizr.at.cimpress.io/v1/resources/${resource}/settings&proxyUrlMethod=put`)
        .reply(200, {
            language: defaultSettings.language.map((item) => item.lang),
            regionalSettings: defaultSettings.regionalSettings,
            timezone: defaultSettings.timezone,
        });
}

const defaultSettings = {
    timezone: 'Europe/Amsterdam',
    regionalSettings: 'en',
    language: [
        {
            'iso639_1': 'bg',
            'iso639_2': 'bul',
            'iso639_3': 'bul',
            'lang': 'bg',
        },
        {
            'iso639_1': 'en',
            'iso639_2': 'eng',
            'iso639_3': 'eng',
            'lang': 'en',
        },
        {
            'iso639_1': 'de',
            'iso639_2': 'deu',
            'iso639_3': 'deu',
            'lang': 'de',
        },
    ],
};

export {
    resource,
    defaultMocks,
    defaultSettings,
};
