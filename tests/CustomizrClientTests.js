import { defaultSettings, resource } from './defaultMocks';
import { CustomizrClient } from '../src/index';
import chai from 'chai';
import nock from 'nock';

const token = 'asd123';
const expect = chai.expect;

const mcpCustomizr = new CustomizrClient({
    resource: 'mcp-generic-ui-settings',
    retryAttempts: 4,
    retryDelayInMs: 200,
});

describe('CustomizrClient', function () {
    // eslint-disable-next-line no-invalid-this
    this.timeout(10000);

    describe('auto retry and fail if all more attempts failed', function () {
        it('should throw', function () {
            nock.cleanAll();
            nock('https://customizr.at.cimpress.io')
                .get(`/v1/resources/${resource}/settings`)
                .times(10000)
                .reply(500);

            return mcpCustomizr
                .getSettings(token)
                .then(() => {
                    throw new Error('Should fail but it did not');
                })
                .catch((error) => {
                    expect(error.message).to.have.string('Request failed with status code 500');
                });
        });
    });

    describe('auto retry and succeed', function () {
        it('should return success', function () {
            nock.cleanAll();
            nock('https://customizr.at.cimpress.io')
                .get(`/v1/resources/${resource}/settings`)
                .times(2)
                .reply(500)
                .get(`/v1/resources/${resource}/settings`)
                .reply(200, {
                    language: defaultSettings.language.map((item) => item.lang),
                    regionalSettings: defaultSettings.regionalSettings,
                    timezone: defaultSettings.timezone,
                });

            return mcpCustomizr
                .getSettings(token)
                .then((settings) => {
                    expect(settings.timezone).to.equal(defaultSettings.timezone);
                });
        });
    });

    describe('proxy request', function () {
        it('request should be to the proxy endpoint and should throw error', function () {
            nock.cleanAll();
            nock('https://sessions.cimpress.io')
                .post(`/v1/sessions/proxy?proxyUrl=https://customizr.at.cimpress.io/v1/resources/${resource}/settings&proxyUrlMethod=get`)
                .times(10000)
                .reply(500);

            return mcpCustomizr
                .getSettings(undefined, undefined, 'testSessionId')
                .then(() => {
                    throw new Error('Should fail but it did not');
                })
                .catch((error) => {
                    expect(error.message).to.have.string('Request failed with status code 500');
                });
        });
    });
});