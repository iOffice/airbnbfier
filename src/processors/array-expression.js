import _ from 'lodash';
import {lintRule} from '../util.js';


function commaDangle(node) {
  const doc = node._owner;
  let last = _.last(node._child);
  while (last && _.indexOf(['Line', '_Line', 'Block', '_Block'], last.type) > -1) {
    last = last._prev;
  }
  if (!last) {
    return;
  }

  const itemized = _.includes(doc.str(last.range[1], node.range[1]), '\n');
  if (itemized && doc.chunks[last.range[1]] !== ',') {
    doc.update(',', last.range[1], last.range[1], null);
  }
}


function processArrayExpression(node, rules) {
  if (lintRule('comma-dangle', rules)) {
    commaDangle(node);
  }
}

export default processArrayExpression;
