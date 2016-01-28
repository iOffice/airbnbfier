import _ from 'lodash';
import {lintRule} from '../util.js';


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

  if (data.length === 2 && _.last(data).type === 'ObjectExpression') {
    const e1 = data[data.length - 2].range[1];
    const e2 = _.last(data).range[0];
    doc.update('(', e1, e2, null);
  }
  // TODO: Find a better way of removing the space. Esprima ignores `(`.
  // doc.update(`new `, node.range[0], data[0].range[0], null);
}

function processNewExpression(node, rules) {
  if (lintRule('doc-comments', rules)) {
    docComments(node);
  }
}

export default processNewExpression;
