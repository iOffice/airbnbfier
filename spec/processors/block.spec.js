const esformat = require('../../src/index.js');
/* eslint-env jasmine */
/* eslint-disable padded-blocks */


describe('block processor:', () => {


  describe('spaced-comment', () => {
    it('should add space between opening comment', () => {
      const before = `
        /*value of pi*/
        const pi = 3.14;
      `;
      const after = `
        /* value of pi */
        const pi = 3.14;
      `;
      expect(esformat(before, ['spaced-comment'])).toBe(after);
    });

    it('should leave the spaces untouched (if any)', () => {
      const before = `
        /*  value of pi  */
        const pi = 3.14;
      `;
      const after = `
        /*  value of pi  */
        const pi = 3.14;
      `;
      expect(esformat(before, ['spaced-comment'])).toBe(after);
    });
  });


});
