import _ from 'lodash';
import {lintRule} from '../util.js';


/**
 * https://github.com/airbnb/javascript#comments
 */
function spacedLineComment(node) {
  const src = node.getSource();
  const match = src.match(/(\/\/)(\s*)(.*)$/) || [];
  if (match.length) {
    node.setSource(match[1] + (match[2] || ' ') + match[3]);
  }
}


/**
 * https://github.com/airbnb/javascript#17.2
 */
function singleInlineComment(node) {
  const ignore = [
    'IfStatement',
    'FunctionExpression',
  ];
  if (node._prev === null || _.indexOf(ignore, node._parent.type) > -1) {
    return;
  }

  const doc = node._owner;
  const chunks = doc.chunks;
  // TODO: Need to update chiles to handle _prev better with if statements
  const nullTextRange = [node._prev.range[1], node.range[0]];
  const nullText = chunks.slice(...nullTextRange);
  if (_.includes(nullText, '\n')) {
    return;
  }

  // removing empty space space
  doc.update('', ...nullTextRange);

  // looking for index where the comment will be inserted
  let index = node.range[0] - 1;
  while (index > 0 && chunks[index] !== '\n') {
    index--;
  }
  if (chunks[index] === '\n') {
    index++;
  }

  // counting the amount of leading whitespace for the comment
  const start = index;
  let count = 0;
  while (_.includes(' \t', chunks[index])) {
    index++;
    count++;
  }

  // moving the comment
  const leadingSpace = _.repeat(' ', count);
  const comment = node.getSource();
  node.setSource('');
  doc.update(`${leadingSpace}\n`, start, start, null);
  doc.insert(comment, start + leadingSpace.length, 'Line');
}


function processLine(node, rules) {
  if (lintRule('spaced-comment', rules)) {
    spacedLineComment(node);
  }
  if (lintRule('single-inline', rules)) {
    singleInlineComment(node);
  }
}


export default processLine;
