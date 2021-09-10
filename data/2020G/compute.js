const fs = require('fs');
const http = require('https');
const glob = require('glob');
const path = require('path');
const hoist = require('@cannery/hoist');

const PartyMap = {
  1: 'dem',
  2: 'rep',
  3: 'ai',
  4: 'pf',
  5: 'lib',
  6: 'grn',
  7: 'npp',
  8: 'all',
};

const ContestToParty = {
  "President DEM": 'dem',
  "President REP": 'rep',
  "President AI": 'ai',
  "President GRN": 'grn',
  "President P&F": 'pf',
  "President LIB": 'lib',
  "CCC District 17 DEM": 'dem',
  "CCC District 19 DEM": 'dem',
  "CCC District 17 REP": 'rep',
  "US House of Rep District 12": 'all',
  "US House of Rep District 13": 'all',
  "US House of Rep District 14": 'all',
  "STATE SENATOR District 11": 'all',
  "STATE ASSEMBLY MEMBER District 17": 'all',
  "STATE ASSEMBLY MEMBER District 19": 'all',
  "Superior Court Judge Seat 1": 'all',
  "Superior Court Judge Seat 18": 'all',
  "Superior Court Judge Seat 21": 'all',
  "Proposition 13": 'all',
  "Proposition A": 'all',
  "Proposition B": 'all',
  "Proposition C": 'all',
  "Proposition D": 'all',
  "Proposition E": 'all',
};

async function parse (loc) {
  const connieVotes = new Set();
  const ballotIdToType = {};
  for (let ballotType of require(path.join(loc, '/BallotTypeManifest.json')).List) {
    if (!ballotType.Id) { continue; }
    let type = 'npp';
    if (!!~ballotType.Description.indexOf('NPP')) {
      type = 'npp';
    }
    else if (!!~ballotType.Description.indexOf('American Independent')) {
      type = 'ai';
    }
    else if (!!~ballotType.Description.indexOf('Peace and Freedom')) {
      type = 'pf'
    }
    else if (!!~ballotType.Description.indexOf('Green')) {
      type = 'grn'
    }
    else if (!!~ballotType.Description.indexOf('Non-Partisan')) {
      type = 'npp'
    }
    else if (!!~ballotType.Description.indexOf('Libertarian')) {
      type = 'lib'
    }
    else if (!!~ballotType.Description.indexOf('Republican')) {
      type = 'rep'
    }
    else if (!!~ballotType.Description.indexOf('Democratic')) {
      type = 'dem'
    }
    ballotIdToType[ballotType.Id] = type;
  }


  const contests = {
    __META__: {
      precincts: {},
      candidates: [],
    },
  };
  const contestIdToName = {};
  const contestIds = [];

  for (let contest of require(path.join(loc, 'ContestManifest.json')).List) {
    if (!contest.Id) { continue; }
    contestIds.push(contest.Description);
    contests[contest.Description] = {};
    contests[contest.Description].__META__ = {
      candidates: [],
      seats: contest.VoteFor,
      ranks: contest.NumOfRanks,
      party: ContestToParty[contest.Description] || 'all',
    };
    contestIdToName[contest.Id] = contest.Description;
  }
  const precincts = {};
  for (let pct of require(path.join(loc, 'PrecinctPortionManifest.json')).List) {
    if (!pct.Id) { continue; }
    if (pct.ExternalId) {
      precincts[pct.Id] = (pct.ExternalId.split('-')[0] || '').trim();
    }
    if (!precincts[pct.Id] && pct.Description) {
      precincts[pct.Id] = pct.Description.split(' ')[1];
    }
    if (precincts[pct.Id]) {
      precincts[pct.Id] = precincts[pct.Id].trim();
    }
  }

  let candidates = [];
  const candidateToDesc = {};
  const candidateToContest = {};
  const candidateIds = [];
  for (let candidate of require(path.join(loc, 'CandidateManifest.json')).List) {
    if (!candidate.Description) { continue; }
    candidateToDesc[candidate.Id] = candidate.Description;
    candidates.push(candidate.Description);
    candidateToContest[candidate.Id] = candidate.ContestId
    candidateIds.push(candidate.Id);
    const contest = contests[contestIdToName[candidate.ContestId]];
    if (contest) {
      const list = new Set(contest.__META__.candidates || []);
      list.add(candidate.Description);
      contest.__META__.candidates = [...list];
    }
  }
  contests.__META__.candidates = [...new Set(candidates)].sort();

  const cvrs = await glob.sync(path.join(loc, 'CvrExport*.json'));

  for (const [contestId, contestName] of Object.entries(contestIdToName)) {
    const ranks = contests[contestName].__META__.ranks;
    const seats = contests[contestName].__META__.seats;
    const losers = new Set();
    console.log(contestId, contestName, ranks, seats);
    rankLoop: for (let rank = 0; rank < (ranks || 1); rank++) {
      let overvotes = 0; // Count how many overvotes happen at each rank.
      if (rank > 0) {
        const results = {};
        for (const [pct, res] of Object.entries(contests[contestName])) {
          if (pct === '__META__') { continue; }
          for (const [candidateName, voteCount] of Object.entries(res[rank - 1] || {})) {
            if (candidateName === '__META__' || candidateName === 'turnout') { continue; }
            results[candidateName] = (results[candidateName] || 0) + voteCount;
          }
        }
        const loser = (Object.entries(results).filter(Boolean).sort((a, b) => a[1] > b[1] ? -1 : 1).pop() || [])[0];
        if ((rank === 1) && results['Write-in']) { losers.add('Write-in'); }
        else if(loser) losers.add(loser);
      }

      console.log('Rank', rank, losers);
      let i = 0;

      for (let cvr of cvrs) {
        const data = require(cvr);
        i+=data.Sessions.length
        // console.log(i++);
        // For each ballot
        ballotLoop: for (let session of data.Sessions) {
          const sess = session.Revised || session.Original || session;
          const precinct = precincts[sess.PrecinctPortionId];
          const ballot = sess.BallotTypeId;

          contests.__META__[precinct] = (contests.__META__[precinct] || new Set());
          contests.__META__[precinct].add(session.ImageMask);
          const cards = sess.Cards || (sess.Contests ? [sess] : []);
          for (let card of cards) {
            contestLoop: for (let contest of card.Contests) {
              if (String(contest.Id) !== String(contestId)) { continue; }
              // if (contest.Overvotes > 0) {
                // console.log('OVERVOTE', JSON.stringify(contest, null, 2));
                // overvotes++;
                // continue;
              // }

              // Get our marks in order. Sort by rank and filter out overvotes within the same rank.
              const markRankCounts = {};
              const marks = contest.Marks = (contest.Marks || []).sort((a, b) => a.Rank > b.Rank ? 1 : -1 ).filter((mark) => {
                if (mark.CandidateId === 19) { connieVotes.add(mark.ManifestationId); }
                const candidateDesc = candidateToDesc[mark.CandidateId];
                if (losers.has(candidateDesc) || contest.isOvervoted) {
                  return false;
                }
                markRankCounts[mark.Rank] = (markRankCounts[mark.Rank] || 0) + (candidateDesc === 'Write-in' ? 0 : 1);
                return true;
              });

              // for (const rankCount of Object.values(markRanks)) {
              //   if (rankCount > 1) { continue contest; }
              // }
              // const marks = [];
              // const rankedOvers = new Set();
              // for (const mark of tmpmarks) {
              //   if (markRanks[mark.Rank] === 1) {
              //     marks.push(mark);
              //   }
              //   else {
              //     rankedOvers.add(mark.Rank);
              //     const candidateDesc = candidateToDesc[mark.CandidateId];
              //     rank == 0 && console.log(mark.Rank, contest.Overvotes, candidateDesc);
              //   }
              // }
              // overvotes += rankedOvers.size;
              // if (rank == 0 && rankedOvers.size) {
              //   console.log('========');
              // }
              contests[contestName][precinct] = contests[contestName][precinct] || {
                turnout: {
                  "npp": 0,
                  "dem": 0,
                  "rep": 0,
                  "ai": 0,
                  "pf": 0,
                  "lib": 0,
                  "grn": 0,
                  "misc": 0,
                  "all": 0,
                }
              };
              if (rank === 0 && marks.length) {
                contests[contestName][precinct].turnout.all = (contests[contestName][precinct].turnout.all || 0) + 1;
                const ballotType = ballotIdToType[sess && sess.BallotTypeId] || 'unk';
                if (ballotType) {
                  contests[contestName][precinct].turnout[ballotType] = (contests[contestName][precinct].turnout[ballotType] || 0) + 1;
                }
              }
              let numMarks = 0;
              for (const mark of marks) {
                const candidateId = mark.CandidateId;
                const candidateDesc = candidateToDesc[candidateId];
                if (markRankCounts[mark.Rank] > seats) {
                  overvotes++;
                  contest.isOvervoted = true;
                  // console.log('overvote', mark.Rank, markRankCounts[mark.Rank], JSON.stringify(contest));
                  continue contestLoop;
                }
                if (mark.IsVote) {
                  numMarks++;
                  contests[contestName][precinct][rank] = contests[contestName][precinct][rank] || {};
                  contests[contestName][precinct][rank][candidateDesc] = (contests[contestName][precinct][rank][candidateDesc] || 0) + 1;
                  if (numMarks === seats) {
                    break;
                  }
                }
              }
            }
          }
        }
      }

      console.log('Overvotes', overvotes, i);
    }

    const results = {};
    for (const [pct, res] of Object.entries(contests[contestName])) {
      if (pct === '__META__') { continue; }
      for (const [candidateName, voteCount] of Object.entries(res[ranks] || {})) {
        if (candidateName === '__META__' || candidateName === 'turnout') { continue; }
        results[candidateName] = (results[candidateName] || 0) + voteCount;
      }
    }
    const loser = (Object.entries(results).filter(Boolean).sort((a, b) => a[1] > b[1] ? -1 : 1).pop() || [])[0];
    loser && losers.add(loser);
  }

  // Get our per precinct aggregate turnout.
  for (const [pct, set] of Object.entries(contests.__META__)) {
    contests.__META__[pct] = set.size;
  }
  contests.__META__.timestamp = Date.now();
  fs.writeFileSync('./out/data.json', JSON.stringify(contests, null, 2))
  console.log('Connie Votes', connieVotes.size
  );
}

const rp = require('request-promise');
const unzip = require('unzipper');

let prev = null;
async function fetch() {
  // const URL = 'https://sfelections.sfgov.org/november-5-2019-election-results-detailed-reports';
  const URL = 'https://sfelections.sfgov.org/november-3-2020-election-results-detailed-reports'
  const html = await rp(URL);
  const res = [...html.matchAll(/https:\/\/www.sfelections.org\/results.*\/CVR_Export.*.zip/g)].map(i => i[0]);
  const latest = res[0];
  console.log(prev, latest);
  if (prev === latest) { throw new Error('Cache is the same.'); }
  const name = path.basename(latest).split('.')[0];
  const pathName = path.join(__dirname, `./tmp/${name}`);
  return new Promise((resolve) => {
    http.get(latest, function(response) {
      response.pipe(unzip.Extract({ path: pathName }));
      prev = latest;
      response.on('close', () => resolve(pathName));
    });
  })
}

async function wait(t) {
  return new Promise((r) => setTimeout(r, t))
}

async function run() {
  // while (true) {
    try {
      const folder = await fetch();
      await wait(1000);
      // await parse(path.join(__dirname, 'tmp', 'CVR_Export_20201106164452'));
      await parse(folder);
      // await hoist.deploy(path.join(__dirname, 'out'));
    } catch (e) {console.error(e)}
    // await wait(60000 * 15);
    // }
    // await parse(path.join(__dirname, 'data'));
  const dat = require('./out/data.json');
  const res = {};
  for (const [pct, value] of Object.entries(dat["BOARD OF SUPERVISORS DISTRICT 1"] || {})) {
    if (pct === '__META__' || !value) { continue; }
    for (const [round, results] of Object.entries(value)) {
      if (round === 'turnout' || !value) { continue; }
      // console.log(pct, round, results);
      res[round] = res[round] || {};
      for (const [candidate, count] of Object.entries(results)) {
        res[round][candidate] = res[round][candidate] || 0;
        res[round][candidate] += count
        res[round].TOTAL = res[round].TOTAL || 0;
        res[round].TOTAL += count
      }
    }
  }
  console.log(res);

}

run();