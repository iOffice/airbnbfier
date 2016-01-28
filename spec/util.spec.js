import {lintRule} from '../src/util.js';
/* eslint-env jasmine */
/* eslint-disable padded-blocks */


describe('util module:', () => {


  describe('function lintRule', () => {
    it('should proceed if rules include the rule', () => {
      expect(lintRule('some-rule', ['some-rule', 'another-rule'])).toBe(true);
    });

    it('should proceed if rules include `--all`', () => {
      expect(lintRule('some-rule', ['--all', 'another-rule'])).toBe(true);
    });

    it('should skip if rules makes the exception', () => {
      expect(lintRule('some-rule', ['--all', '--except', 'some-rule'])).toBe(false);
    });

    it('should skip if rules makes the exception', () => {
      expect(lintRule('some-rule', ['--all', '--except', 'some-rule'])).toBe(false);
    });
  });


});
