const airbnbfy = require('../../src/index.js');
/* eslint-env jasmine */
/* eslint-disable padded-blocks */


describe('block-statement processor:', () => {


  describe('return-this', () => {
    it('should not add it to constructors', () => {
      const before = `
        class A {
          constructor() {
          }
          setMethod(x){
            this.prop = x;
          }
        }
      `;
      const after = `
        class A {
          constructor() {
          }
          setMethod(x){
            this.prop = x;
            return this;
          }
        }
      `;
      expect(airbnbfy(before, ['return-this'])).toBe(after);
    });

    it('should not add it to `initialize`', () => {
      const before = `
        const A = new Class({
          initialize() {
          },
          setProp(x){
            this.prop = x;
          }
        });
      `;
      const after = `
        const A = new Class({
          initialize() {
          },
          setProp(x){
            this.prop = x;
            return this;
          }
        });
      `;
      expect(airbnbfy(before, ['return-this'])).toBe(after);
    });

    it('should not add it if it already returns something', () => {
      const before = `
        const A = new Class({
          initialize() {
          },
          getProp() {
            return this.prop;
          },
          setProp(x){
            this.prop = x;
          }
        });
      `;
      const after = `
        const A = new Class({
          initialize() {
          },
          getProp() {
            return this.prop;
          },
          setProp(x){
            this.prop = x;
            return this;
          }
        });
      `;
      expect(airbnbfy(before, ['return-this'])).toBe(after);
    });
  });


});
