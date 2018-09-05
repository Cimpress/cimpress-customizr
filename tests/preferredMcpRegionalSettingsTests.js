import {getPreferredMcpRegionalSettings, setPreferredMcpRegionalSettings} from '../src/index';
import chai from 'chai';

const token = 'asd123';
const expect = chai.expect;

import {defaultMocks, defaultSettings} from './defaultMocks';

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
    });

    describe('setPreferredMcpRegionalSettings', function() {
        it('should accept a valid language tag', function() {
            return setPreferredMcpRegionalSettings(token, 'de')
                .then(() => {
                    // empty
                });
        });
        /* TODO:
        it('should fail with incorrect regionalSettings value', function() {
            return setPreferredMcpRegionalSettings(token, 'wrong/regional/settings')
                .then(() => {
                    throw new Error('Setting regional settings succeeded with incorrect language tag!');
                })
                .catch((error) => {
                    expect(error.message).to.have.string('Expected a valid rfc5646 language tag');
                });
        });
        */
    });
});


