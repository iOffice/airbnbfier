function isValidPropName(name) {
  const notValid = [
    'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally',
    'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try',
    'typeof', 'var', 'void', 'while', 'with', 'class', 'const', 'enum', 'export', 'extends',
    'import', 'super', 'implements', 'interface', 'let', 'package', 'private', 'protected',
    'public', 'static', 'yield', 'null', 'true', 'false',
  ];
  const match = name.match(/([a-zA-Z_$][0-9a-zA-Z_$]*)/) || [];
  return match[0] === name && notValid.indexOf(name) === -1;
}


function lintRule(rule, rules) {
  const inRule = rules.indexOf(rule) > -1;
  let proceed = false;

  if (rules.indexOf('--all') > -1) {
    // Process all the rules
    proceed = true;
  }
  if (rules.indexOf('--except') > -1) {
    if (inRule) {
      return false;
    }
  }
  if (inRule) {
    proceed = true;
  }

  return proceed;
}


export {
  lintRule,
  isValidPropName,
};
