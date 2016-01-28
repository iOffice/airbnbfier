import _ from 'lodash';
import {lintRule} from '../util.js';


function commaDangle(node) {
  const doc = node._owner;
  const last = _.last(node.properties);
  if (!last) {
    return;
  }

  const itemized = _.includes(doc.str(last.range[1], node.range[1]), '\n');
  if (itemized && doc.chunks[last.range[1]] !== ',') {
    doc.update(',', last.range[1], last.range[1], null);
  }
}


function computeMethodSpace(method) {
  let space = '';
  const match = method.match(/(^[\s]*)/);
  let toInsert = 2 - (match[1].match(/\n/gm) || []).length;
  while (toInsert > 0) {
    space += '\n';
    toInsert--;
  }
  return space;
}


function getPropSrc(node) {
  const doc = node._owner;
  const commaIndex = [];
  _.each(node._child, (item, index) => {
    const start = item.range[1];
    const next = node._child[index + 1];
    const end = next ? next.range[0] : node.range[1];
    const text = doc.str(start, end);
    const delta = text.indexOf(',');
    if (delta > -1) {
      commaIndex.push(start + delta);
    }
  });
  if (!commaIndex.length) {
    return null;
  }

  const props = [doc.str(node.range[0] + 1, commaIndex[0])];
  _.each(commaIndex, (start, index) => {
    const end = commaIndex[index + 1] ? commaIndex[index + 1] : node.range[1] - 1;
    props.push(doc.str(start + 1, end));
  });
  return props;
}


function methodSpace(node) {
  if (!node._child.length) {
    return;
  }

  const props = getPropSrc(node);
  if (props === null) {
    return;
  }

  const hasTrailingComma = _.trim(props[props.length - 1]) === '';
  let tail = '';
  if (hasTrailingComma) {
    tail = props.pop();
  }

  let isMethod = false;
  let trailingSpace = '';
  let addComma = hasTrailingComma;
  if (_.indexOf(['Line', 'Block', '_Line', '_Block'], _.last(node._child).type) > -1) {
    addComma = false;
  }

  let src = '{';
  _.each(props, (prop, index) => {
    const crtProp = node.properties[index];
    const nextProp = node.properties[index + 1];
    isMethod = false;
    trailingSpace = '';

    const match = prop.match(/(\s+)$/) || [];
    if (crtProp && crtProp.method) {
      isMethod = true;
      src += computeMethodSpace(prop) + _.trimEnd(prop);
    } else {
      src += _.trimEnd(prop);
    }
    if (match.length) {
      trailingSpace = match[1];
    }

    if (index < props.length - 1 || addComma) {
      src += ',';
    }

    if (isMethod && (nextProp === undefined || !nextProp.method)) {
      src += computeMethodSpace(props[index + 1] || '');
    } else {
      src += trailingSpace;
    }
  });
  if (isMethod) {
    src += _.last(tail.split('\n')) + _.last(trailingSpace.split('\n'));
  } else {
    src += tail;
  }
  src += '}';
  node.setSource(src);
}


function processObjectExpression(node, rules) {
  if (lintRule('comma-dangle', rules)) {
    commaDangle(node);
  }
  if (lintRule('method-space', rules)) {
    methodSpace(node);
  }
}

export default processObjectExpression;
