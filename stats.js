const dat = require('./out/data.json');

const res = {};
for (const [pct, value] of Object.entries(dat['BOARD OF SUPERVISORS DISTRICT 1'])) {
  if (pct === '__META__' || !value) { continue; }
  for (const [round, results] of Object.entries(value)) {
    if (round === 'turnout' || !value) { continue; }
    // console.log(pct, round, results);
    res[round] = res[round] || {};
    for (const [candidate, count] of Object.entries(results)) {
      res[round][candidate] = res[round][candidate] || 0;
      res[round][candidate] += count
    }
  }
}
console.log(res);
