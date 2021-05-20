import { getPreferredMcpRegionalSettings, getPreferredMcpTimezone, setPreferredMcpTimezone } from '../src/index';
import chai from 'chai';

const token = 'asd123';
const expect = chai.expect;

import { defaultMocks, resource } from './defaultMocks';
import nock from "nock";

describe('Timezone', function () {
    beforeEach(function () {
        defaultMocks();
    });

    describe('getPreferredMcpTimezone', function () {
        it('should return expected timezone', function () {
            return getPreferredMcpTimezone(token).then((timezone) => {
                expect(timezone).to.equal('Europe/Amsterdam');
            });
        });

        it('should not throw in case of 404 from customizr', function () {
            nock.cleanAll();
            nock('https://customizr.at.cimpress.io')
                .get(`/v1/resources/${resource}/settings`)
                .reply(404);

            return getPreferredMcpTimezone(token).then((timezone) => {
                expect(timezone).to.deep.equal('America/New_York');
            });
        });

        it('should return expected timezone by proxying request', function () {
            return getPreferredMcpTimezone(undefined, 'testSessionId').then((timezone) => {
                expect(timezone).to.equal('Europe/Amsterdam');
            });
        });
    });

    describe('setPreferredMcpTimezone', function () {
        it('should accept a valid timezone', function () {
            return setPreferredMcpTimezone(token, 'Europe/Sofia')
                .then(() => {
                    // empty
                });
        });
        it('should accept a valid timezone', function () {
            return setPreferredMcpTimezone(token, 'W-SU')
                .then(() => {
                    // empty
                });
        });
        it('should fail with incorrect timezone', function () {
            return setPreferredMcpTimezone(token, 'wrong/timezone')
                .then((timezone) => {
                    throw new Error('Setting timezone succeeded with incorrect timezone!');
                })
                .catch((error) => {
                    expect(error.message).to.have.string('Provided timezone is not valid. Please pass valid IANA timezone identifier');
                });
        });
    });
});

