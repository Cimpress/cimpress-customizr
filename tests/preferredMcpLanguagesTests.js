import {getPreferredMcpLanguages} from '../src/index';
import chai from 'chai';

const token = 'asd123';
const expect = chai.expect;

import {defaultMocks, defaultSettings} from './defaultMocks';

describe('Languages', function() {
    beforeEach(function() {
        defaultMocks();
    });

    describe('getPreferredMcpLanguages', function() {
        it('should return expected preferred languages list', function() {
            return getPreferredMcpLanguages(token).then((langs) => {
                expect(langs).to.deep.equal(defaultSettings.language);
            });
        });
    });
});
