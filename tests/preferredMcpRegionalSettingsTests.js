import {
    getPreferredMcpLanguages,
    getPreferredMcpRegionalSettings,
    setPreferredMcpRegionalSettings,
} from '../src/index';
import chai from 'chai';

const token = 'asd123';
const expect = chai.expect;

import { defaultMocks, defaultSettings, resource } from './defaultMocks';
import nock from 'nock';

describe('Regional settings', function () {
    beforeEach(function () {
        defaultMocks();
    });

    describe('getPreferredMcpRegionalSettings', function () {
        it('should return expected regionalSettings', function () {
            return getPreferredMcpRegionalSettings(token).then((regionalSettings) => {
                expect(regionalSettings).to.equal(defaultSettings.regionalSettings);
            });
        });

        it('should not throw in case of 404 from customizr', function () {
            nock.cleanAll();
            nock('https://customizr.at.cimpress.io')
                .get(`/v1/resources/${resource}/settings`)
                .reply(404);

            return getPreferredMcpRegionalSettings(token).then((regionalSettings) => {
                expect(regionalSettings).to.equal(undefined);
            });
        });

        it('should return expected regionalSettings by proxying request', function () {
            return getPreferredMcpRegionalSettings(undefined, 'testSessionId').then((regionalSettings) => {
                expect(regionalSettings).to.equal(defaultSettings.regionalSettings);
            });
        });
    });

    describe('setPreferredMcpRegionalSettings', function () {
        it('should accept a valid language tag', function () {
            return setPreferredMcpRegionalSettings(token, 'de')
                .then(() => {
                    // empty
                });
        });
    });
});


