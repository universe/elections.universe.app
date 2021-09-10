const fs = require('fs');
const readline = require('readline');
const childProcess = require('child_process');
const ProgressBar = require('cli-progress');

const progress = new ProgressBar.Bar({}, ProgressBar.Presets.shades_classic);

const FILE = './SOV_NOV2014.txt';

function enterPct(data, out) {
  if (data.race === 'REGISTERED VOTERS - TOTAL') {
    out.__META__ = out.__META__ || {};
    out.__META__[data.pct] = (out.__META__[data.pct] || 0) + data.count;
  }
  else if (data.race === 'BALLOTS CAST - TOTAL') { return; }
  else {
    const race = out[data.race] = out[data.race] || {
      __META__: {
        candidates: [],
        seats: 1,
        ranks: 1,
        party: null,
      }
    }
    const pct = race[data.pct] = race[data.pct] || {
      '0': {},
      turnout: {
        VBM: 0,
        'Election Day': 0,
        all: 0,
      },
    };
    race.__META__.candidates = [...new Set([ ...(race.__META__.candidates || []), data.candidate ])];
    pct[0][data.candidate] = (pct[0][data.candidate] || 0) + data.count;
    pct[0].TOTAL = (pct[0].TOTAL || 0) + data.count;
    pct.turnout[data.type] = (pct.turnout[data.type] || 0) + data.count;
    pct.turnout.all = (pct.turnout.all || 0) + data.count;
  }
}

async function processLineByLine() {
  const total = parseInt(childProcess.execSync(`wc -l < ${FILE}`).toString().trim());

  progress.start(total, 0);

  const out = {};

  const fileStream = fs.createReadStream(FILE);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    progress.increment(1);
    // Each line in input.txt will be successively available here as `line`.
    const data = {
      id: line.slice(0, 26).trim(),
      count: parseInt(line.slice(11, 16).trim()),
      race: line.slice(26, 82).trim(),
      candidate: line.slice(82, 120).trim(),
      pct: line.slice(120, 150).trim().replace('Pct ', ''),
      type: line.slice(175, line.length).trim(),
    };

    if (data.pct.indexOf('/')) {
      const pcts = data.pct.split('/');
      data.pct = pcts[0];
      enterPct(data, out);
      data.pct = pcts[1];
      enterPct(data, out);
    }
    else {
      enterPct(data, out);
    }
  }

  fs.writeFileSync('./data.json', JSON.stringify(out, null, 2));
}

processLineByLine();