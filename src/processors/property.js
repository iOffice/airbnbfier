import {lintRule, isValidPropName} from '../util.js';


/**
 * https://github.com/airbnb/javascript#3.5
 */
function objectShortHand(node) {
  if (node.madeMethod) {
    const src = node.getSource();
    if (node.unquotedPropertyName) {
      node.setSource(src.replace(/(.*?):(\s*)/i, node.unquotedPropertyName));
    } else {
      node.setSource(src.replace(/(\w)(\s*):(\s*)/i, '$1'));
    }
  }
}

function unquoteProps(node) {
  const src = node.getSource();
  if (node.unquotedPropertyName) {
    node.setSource(src.replace(/(.*?):(\s*)/i, `${node.unquotedPropertyName}: `));
  }
}


function processProperty(node, rules) {
  if (node.key.type === 'Literal') {
    const name = node.key.value;
    if (typeof name === 'string' && isValidPropName(name)) {
      node.unquotedPropertyName = name;
    }
  }

  if (lintRule('unquote-props', rules)) {
    unquoteProps(node);
  }
  if (lintRule('object-shorthand', rules)) {
    objectShortHand(node);
  }
}


export default processProperty;
