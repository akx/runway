export default function evalInEnv(expr, env) {
  const argNames = [], argValues = [];
  Object.keys(env).forEach((label) => {
    argNames.push(label);
    argValues.push(env[label]);
  });
  const fn = new Function(argNames.join(','), `return ${expr};`);  // eslint-disable-line no-new-func
  return fn.apply(null, argValues);
}
