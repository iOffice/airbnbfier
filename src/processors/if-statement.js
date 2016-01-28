import _ from 'lodash';
import {lintRule} from '../util.js';


function getIndent(node) {
  const doc = node._owner;
  const chunks = doc.chunks;
  let index = node.range[0] - 1;
  while (index > 0 && chunks[index] !== '\n') {
    index--;
  }
  if (chunks[index] === '\n') {
    index++;
  }
  return _.repeat(' ', (node.range[0] - index) + 2);
}


/**
 * https://github.com/airbnb/javascript#16.2
 */
function braceStyle(node) {
  const commentTypes = ['Line', '_Line', 'Block', '_Block'];
  const doc = node._owner;
  const consequent = node.consequent;
  const alternate = node.alternate;
  const indent = getIndent(node);
  const misplacedComments = [];
  let crt = null;
  let condition = null;
  let str = '';
  let startMisplaced = null;

  if (consequent.type === 'BlockStatement') {
    crt = consequent._prev;
    while (crt !== null) {
      if (commentTypes.indexOf(crt.type) > -1) {
        str = crt.getSource();
        crt.setSource('');
        if (str) {
          misplacedComments.unshift(str);
        }
      } else {
        condition = crt;
      }
      crt = crt._prev;
    }
    if (misplacedComments.length) {
      doc.insert(
        `\n${indent}${misplacedComments.join('\n' + indent)}\n`,
        consequent.range[0] + 1,
        'MisplacedComments'
      );
      misplacedComments.splice(0, misplacedComments.length);
    }
  }
  if (alternate) {
    if (alternate.type === 'BlockStatement' || alternate.type === 'IfStatement') {
      crt = alternate._prev;
      while (crt !== consequent) {
        if (commentTypes.indexOf(crt.type) > -1) {
          str = crt.getSource();
          crt.setSource('');
          if (str) {
            misplacedComments.unshift(str);
          }
        }
        crt = crt._prev;
      }
      if (alternate.type === 'BlockStatement') {
        startMisplaced = alternate.range[0] + 1;
      } else {
        startMisplaced = alternate.consequent.range[0] + 1;
      }
      if (misplacedComments.length) {
        doc.insert(
          `\n${indent}${misplacedComments.join('\n' + indent)}\n`,
          startMisplaced,
          'MisplacedComments'
        );
        misplacedComments.splice(0, misplacedComments.length);
      }
    }
  }
  if (condition) {
    doc.update(`if (${condition.getSource()}) `, node.range[0], consequent.range[0], null);
    if (alternate && (alternate.type === 'BlockStatement' || alternate.type === 'IfStatement')) {
      doc.update(` else `, consequent.range[1], alternate.range[0], null);
    }
  }
}


function processIfStatement(node, rules) {
  if (lintRule('brace-style', rules)) {
    braceStyle(node);
  }
}


export default processIfStatement;
