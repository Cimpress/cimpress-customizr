import { getPreferredMcpLanguages } from '../src/index';
import chai from 'chai';

const token = 'asd123';
const expect = chai.expect;

import { defaultMocks, defaultSettings, resource } from './defaultMocks';
import nock from 'nock';

describe('Languages', function () {
    describe('getPreferredMcpLanguages', function () {
        beforeEach(function () {
            defaultMocks();
        });

        it('should return expected preferred languages list', function () {
            return getPreferredMcpLanguages(token).then((langs) => {
                expect(langs).to.deep.equal(defaultSettings.language);
            });
        });

        it('should not throw in case of 404 from customizr', function () {
            nock.cleanAll();
            nock('https://customizr.at.cimpress.io')
                .get(`/v1/resources/${resource}/settings`)
                .reply(404);

            return getPreferredMcpLanguages(token).then((langs) => {
                expect(langs).to.deep.equal([{
                    iso639_1: 'en',
                    iso639_2: 'eng',
                    iso639_3: 'eng',
                    lang: 'en',
                }]);
            });
        });

        it('should proxy the request', function () {
            return getPreferredMcpLanguages(undefined, 'testSessionId').then((langs) => {
                expect(langs).to.deep.equal(defaultSettings.language);
            });
        });
    });
});
