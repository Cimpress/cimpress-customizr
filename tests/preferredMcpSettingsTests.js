import { getMcpSettings } from '../src/index';
import chai from 'chai';

const token = 'asd123';
const expect = chai.expect;

import { defaultMocks, resource } from './defaultMocks';
import nock from 'nock';

describe('Settings', function () {

    describe('getMcpSettings', function () {
        beforeEach(function () {
            defaultMocks();
        });

        it('should return expected preferred languages list', function () {
            return getMcpSettings(token).then((langs) => {
                expect(langs).to.deep.equal({
                    language: [
                        'bg',
                        'en',
                        'de',
                    ],
                    regionalSettings: 'en',
                    timezone: 'Europe/Amsterdam',
                });
            });
        });

        it('should not throw in case of 404 from customizr', function () {
            nock.cleanAll();
            nock('https://customizr.at.cimpress.io')
                .get(`/v1/resources/${resource}/settings`)
                .reply(404);

            return getMcpSettings(token).then((langs) => {
                expect(langs).to.deep.equal({
                    language: ['en'],
                    regionalSettings: 'en',
                    timezone: 'America/New_York',
                });
            });
        });

        it('should return expected preferred languages list by proxying request', function () {
            return getMcpSettings(undefined, 'testSessionId').then((langs) => {
                expect(langs).to.deep.equal({
                    language: [
                        'bg',
                        'en',
                        'de',
                    ],
                    regionalSettings: 'en',
                    timezone: 'Europe/Amsterdam',
                });
            });
        });
    });
});
