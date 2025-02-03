import {
    getPreferredMcpLanguages,
    getPreferredMcpRegionalSettings,
    setPreferredMcpRegionalSettings,
} from '../lib/index';
import chai from 'chai';
import fetchMock from 'fetch-mock';

const token = 'asd123';
const expect = chai.expect;

import {defaultMocks, defaultSettings, resource} from './defaultMocks';
import nock from 'nock';

describe('Regional settings', function() {
    beforeEach(function() {
        defaultMocks();
    });

    describe('getPreferredMcpRegionalSettings', function() {
        it('should return expected regionalSettings', function() {
            return getPreferredMcpRegionalSettings(token).then((regionalSettings) => {
                expect(regionalSettings).to.equal(defaultSettings.regionalSettings);
            });
        });

        it('should not throw in case of 404 from customizr', function() {
            nock.cleanAll();
            fetchMock.mockGlobal().get(`https://customizr.at.cimpress.io/v1/resources/${resource}/settings`, 404, {headers: {authorization: 'Bearer asd123'}});

            return getPreferredMcpRegionalSettings(token).then((regionalSettings) => {
                expect(regionalSettings).to.equal(undefined);
                fetchMock.unmockGlobal();
            });
        });

        it('should return expected regionalSettings by proxying request', function() {
            return getPreferredMcpRegionalSettings(undefined, 'testSessionId').then((regionalSettings) => {
                expect(regionalSettings).to.equal(defaultSettings.regionalSettings);
            });
        });
    });

    describe('setPreferredMcpRegionalSettings', function() {
        it('should accept a valid language tag', function() {
            return setPreferredMcpRegionalSettings(token, 'de')
                .then(() => {
                    // empty
                });
        });
    });
});


