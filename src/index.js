import processArrayExpression from './processors/array-expression.js';
import processBlock from './processors/block.js';
import processBlockStatement from './processors/block-statement.js';
import processFunctionExpression from './processors/function-expression.js';
import processIfStatement from './processors/if-statement.js';
import processLine from './processors/line.js';
import processNewExpression from './processors/new-expression.js';
import processObjectExpression from './processors/object-expression.js';
import processProperty from './processors/property.js';


const chiles = require('chiles');
const nodeProcessors = {
  ArrayExpression: processArrayExpression,
  Block: processBlock,
  BlockStatement: processBlockStatement,
  FunctionExpression: processFunctionExpression,
  IfStatement: processIfStatement,
  Line: processLine,
  NewExpression: processNewExpression,
  ObjectExpression: processObjectExpression,
  Property: processProperty,
};


/**
 * Supported Rules:
 *
 * - comma-dangle
 * - spaced-comment
 * - return-this
 * - doc-comments
 * - brace-style
 * - object-shorthand
 * - single-inline
 * - method-space
 * - unquote-props
 *
 * Note that rules also accept `--all` and `--except`.
 */
function airbnbfy(text, rules = []) {
  const doc = chiles(text);
  doc.walkPostOrder((node) => {
    if (nodeProcessors[node.type]) {
      nodeProcessors[node.type](node, rules);
    }
  });
  return doc.toString();
}

module.exports = airbnbfy;
