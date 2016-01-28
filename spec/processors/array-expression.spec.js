const airbnbfy = require('../../src/index.js');
/* eslint-env jasmine */
/* eslint-disable padded-blocks */


describe('array-expression processor:', () => {


  describe('comma-dangle', () => {
    it('should add trailing comma when itemized', () => {
      const before = `
        var a = [
          1,
          2
        ];
      `;
      const after = `
        var a = [
          1,
          2,
        ];
      `;
      expect(airbnbfy(before, ['comma-dangle'])).toBe(after);
    });

    it('should ignore comments', () => {
      const before = `
        var a = [
          1,
          2 // last item
        ];
      `;
      const after = `
        var a = [
          1,
          2, // last item
        ];
      `;
      expect(airbnbfy(before, ['comma-dangle'])).toBe(after);
    });
  });


});
