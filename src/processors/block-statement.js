import _ from 'lodash';
import {lintRule} from '../util.js';


function returnThis(node) {
  const parent = node._parent;
  if (parent.type !== 'FunctionExpression') {
    return;
  }

  const def = parent._parent;
  if (def.type === 'Property') {
    if (def.key.name === 'initialize') {
      return;
    }
  } else if (def.type === 'MethodDefinition') {
    if (def.kind === 'constructor') {
      return;
    }
  } else {
    return;
  }

  const lines = node.body;
  const last = _.last(lines);
  if (last && last.type === 'ReturnStatement') {
    return;
  }

  const content = node.getSource().split('\n');
  const index = content.length - 2;
  const line = content[index];
  if (!line) {
    return;
  }
  const space = line.match(/(\s*)/)[0];

  content[index] = `${line}\n${space}return this;`;
  node.setSource(content.join('\n'));
}


function processBlockStatement(node, rules) {
  if (lintRule('return-this', rules)) {
    returnThis(node);
  }
}

export default processBlockStatement;
