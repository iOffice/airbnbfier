const airbnbfy = require('../../src/index.js');
/* eslint-env jasmine */
/* eslint-disable padded-blocks */


describe('line processor:', () => {


  describe('spaced-comment', () => {
    it('should add space between opening comment', () => {
      const before = `
        //value of pi
        const pi = 3.14;
      `;
      const after = `
        // value of pi
        const pi = 3.14;
      `;
      expect(airbnbfy(before, ['spaced-comment'])).toBe(after);
    });

    it('should leave the spaces untouched (if any)', () => {
      const before = `
        //   value of pi
        const pi = 3.14;
      `;
      const after = `
        //   value of pi
        const pi = 3.14;
      `;
      expect(airbnbfy(before, ['spaced-comment'])).toBe(after);
    });
  });


  describe('single-inline', () => {
    it('should move the inline comment to the line above', () => {
      const before = `
        const pi = 3.14;    //value of pi
      `;
      const after = `
        //value of pi
        const pi = 3.14;
      `;
      expect(airbnbfy(before, ['single-inline'])).toBe(after);
    });

    it('should leave the same indentation', () => {
      const before = `
        if (declarePi) {
          const pi = 3.14;    //   value of pi
        }
      `;
      const after = `
        if (declarePi) {
          //   value of pi
          const pi = 3.14;
        }
      `;
      expect(airbnbfy(before, ['single-inline'])).toBe(after);
    });
  });


});
