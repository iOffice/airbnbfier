import {lintRule} from '../util.js';


/**
 * https://github.com/airbnb/javascript#comments
 */
function spacedBlockComment(node) {
  const src = node.getSource();
  const match = src.match(/(\/\*)([\*]*)(\s*)((.|\n)*)(\*\/)/m) || [];
  if (match.length) {
    const char = match[4][match[4].length - 1];
    let lastSpace = (char !== ' ' && char !== '\n') ? ' ' : '';
    if (!char || char === '*') {
      lastSpace = '';
    }
    node.setSource(
      match[1] + match[2] + (match[3] || ' ') + match[4] + lastSpace + match[6]
    );
  }
}


function processBlock(node, rules) {
  if (lintRule('spaced-comment', rules)) {
    spacedBlockComment(node);
  }
}


export default processBlock;
