import evalInEnv from './env-eval';

function zeroPad(v) {
  v = '' + v;
  return v.length < 2 ? `0${v}` : v;
}

export function evaluateDateExpr(expr, dateEnv) {
  var m;
  if ((m = /^(\d+)-(\d+)-(\d+)$/.exec(expr))) {
    return (
      dateEnv.y === parseInt(m[1], 10) &&
      dateEnv.m === parseInt(m[2], 10) &&
      dateEnv.d === parseInt(m[3], 10)
    );
  }
  if (/^(\d+)-(\d+)$/.test(expr)) {
    return expr === dateEnv.ym && dateEnv.d === 1;
  }
  return evalInEnv(expr, dateEnv);
}

export function validateDateExpr(expr) {
  try {
    evaluateDateExpr(expr, getDateEnvFromTimestamp(0));
    return true;
  } catch (e) {
    return false;
  }

}

export function getDateEnvFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  const ym = `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}`;
  const ymd = `${ym}-${zeroPad(date.getDate())}`;
  return {
    d: date.getDate(),
    m: date.getMonth() + 1,
    y: date.getFullYear(),
    ym,
    ymd,
  };
}
