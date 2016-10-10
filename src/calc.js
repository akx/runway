import {evaluateDateExpr, getDateEnvFromTimestamp} from './date-expr';
import {evaluateValueExpr} from './value-expr';

export default function (rows, start, end) {
  rows = rows.filter((r) => r.enabled);
  const startTimestamp = +new Date(start);
  const endTimestamp = +new Date(end);
  var timestamp = startTimestamp;
  const events = [];
  const pushEvent = (timestamp, row) => {
    let value = null;
    try {
      value = evaluateValueExpr(events, timestamp, row.value);
    } catch(e) {

    }
    if(value !== null) {
      events.push({timestamp, label: row.label, value});
    }
  };
  while (timestamp <= endTimestamp) {
    const dateEnv = getDateEnvFromTimestamp(timestamp);
    rows.filter((r) => {
      try {
        return evaluateDateExpr(r.expr, dateEnv);
      } catch(e) {
        return null;
      }
    }).forEach((r) => { // eslint-disable-line
      pushEvent(timestamp, r);
    });
    timestamp += 86400000;
  }
  var sum = 0;
  events.forEach((e) => {
    sum += e.value;
    e.cumulative = sum;
  });
  return events;
}
