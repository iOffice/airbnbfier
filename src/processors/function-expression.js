import _ from 'lodash';
import {lintRule, isValidPropName} from '../util.js';


function alignComment(c, spaces) {
  if (_.startsWith(c, '/**')) {
    return _.map(c.split('\n'), (line, index) => {
      return _.repeat(' ', spaces + (index ? 1 : 0)) + _.trimStart(line);
    }).join('\n');
  }
  return _.repeat(' ', spaces) + c;
}

function docComments(node) {
  const misplacedComments = [];
  const data = [];
  _.each(node._child, n => {
    if (_.indexOf(['Block', '_Block', 'Line', '_Line'], n.type) > -1) {
      misplacedComments.push(n.getSource());
      n.setSource('');
    } else {
      data.push(n);
    }
  });

  const doc = node._owner;
  const chunks = doc.chunks;
  let index = node.range[0] - 1;
  while (index > 0 && chunks[index] !== '\n') {
    index--;
  }
  if (chunks[index] === '\n') {
    index++;
  }
  const insertionIndex = index;
  let count = 0;
  while (chunks[index] === ' ') {
    index++;
    count++;
  }

  const updatedComments = _.map(misplacedComments, c => alignComment(c, count));
  if (updatedComments.length) {
    doc.insert(updatedComments.join('\n') + '\n', insertionIndex, 'Block');
  }
}


/**
 * https://github.com/airbnb/javascript#3.5
 */
function objectShortHand(node) {
  const parentNode = node._parent;
  if (parentNode.type === 'Property' && !parentNode.method) {
    if (parentNode.key.type === 'Literal') {
      const name = parentNode.key.value;
      if (!isValidPropName(name)) {
        // Nothing we can do, leave it alone
        return;
      }
    }

    const src = node.getSource();
    node.setSource(src.replace(/(function)(\s*)(\w*)\(/, '('));
    parentNode.method = true;
    parentNode.madeMethod = true;
  }
}


function braceStyle(node) {
  const doc = node._owner;
  const chunks = doc.chunks;
  const block = node.body;
  const end = block.range[0];
  let index = end - 1;
  while (chunks[index] === ' ' || chunks[index] === '\n') {
    index--;
  }
  const start = index + 1;
  doc.update(' ', start, end, null);
}


function processFunctionExpression(node, rules) {
  if (lintRule('doc-comments', rules)) {
    docComments(node);
  }
  if (lintRule('brace-style', rules)) {
    braceStyle(node);
  }
  if (lintRule('object-shorthand', rules)) {
    objectShortHand(node);
  }
}

export default processFunctionExpression;
