import evalInEnv from './env-eval';

export function evaluateValueExpr(events, timestamp, expr) {
  var value = parseFloat(expr);
  if (isNaN(value)) {
    const env = {};
    events.filter((e) => e.timestamp <= timestamp).forEach(({label, value}) => {
      env[label] = value;
    });
    value = evalInEnv(expr, env, 0);
  }
  return value;
}


export function validateValueExpr(expr) {
  try {
    evaluateValueExpr([], 0, expr);
    return true;
  } catch (e) {
    return false;
  }
}
