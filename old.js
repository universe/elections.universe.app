const fs = require('fs');
const glob = require('glob');

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

async function run () {

  const ballotIdToType = {};
  for (let ballotType of require('./data/BallotTypeManifest.json').List) {
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

  for (let contest of require('./data/ContestManifest.json').List) {
    if (!contest.Id) { continue; }
    contestIds.push(contest.Description);
    contests[contest.Description] = {};
    contests[contest.Description].__META__ = {
      seats: contest.VoteFor,
      ranks: contest.NumOfRanks,
      party: ContestToParty[contest.Description] || 'all',
    };
    contestIdToName[contest.Id] = contest.Description;
  }

  const precincts = {};
  const pctIds = [];
  for (let pct of require('./data/PrecinctPortionManifest.json').List) {
    if (!pct.Id) { continue; }
    if (pct.Id === '7648') { continue; }
    precincts[pct.Id] = pct.ExternalId;
    for (let contest of contestIds) {
      pctIds.push(pct.ExternalId);
    }
  }

  let candidates = [];
  const candidateToDesc = {};
  const candidateToContest = {};
  const candidateIds = [];
  for (let candidate of require('./data/CandidateManifest.json').List) {
    if (!candidate.Description) { continue; }
    candidateToDesc[candidate.Id] = candidate.Description;
    candidates.push(candidate.Description);
    candidateToContest[candidate.Id] = candidate.ContestId
    candidateIds.push(candidate.Id);
  }
  contests.__META__.candidates = [...new Set(candidates)].sort();

  const cvrs = await glob.sync('./data/CvrExport*.json');
  for (let cvr of cvrs) {
    const data = require(cvr);
    for (let session of data.Sessions) {
      const sess = session.Revised || session.Original;
      const precinct = precincts[sess.PrecinctPortionId];
      if (precinct === '7648') { continue; }
      const ballot = sess.BallotTypeId;

      contests.__META__[precinct] = (contests.__META__[precinct] || 0) + 1;
      for (let card of sess.Cards) {
        for (let contest of card.Contests) {
          contestName = contestIdToName[contest.Id];
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
          if (contest.Marks.length && contest.Overvotes === 0) {
            contests[contestName][precinct].turnout.all = (contests[contestName][precinct].turnout.all || 0) + 1;
            const ballotType = ballotIdToType[sess.BallotTypeId];
            if (ballotType) {
              contests[contestName][precinct].turnout[ballotType] = (contests[contestName][precinct].turnout[ballotType] || 0) + 1;
            }
          }
          for (let mark of contest.Marks) {
            if (mark.IsVote) {
              const candidateId = mark.CandidateId;
              const contestName = contestIdToName[candidateToContest[candidateId]];
              const candidateDesc = candidateToDesc[candidateId];
              contests[contestName][precinct][candidateDesc] = (contests[contestName][precinct][candidateDesc] || 0) + 1;
            }
          }
        }
      }
    }
  }

  fs.writeFileSync('./src/06/75/2020P/out.json', JSON.stringify(contests, null, 2))

}

run();