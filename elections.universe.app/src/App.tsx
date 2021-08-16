/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Map from './Map/Map';
import Panel from './Panel/Panel';
import logo from './images/universe.svg';
import { MapType, ensureMapType } from './types';

const RACE_NAME = `November 3rd 2020 San Francisco`;


function getSearchParam(regexp: RegExp) {
  return ((regexp.exec(window.location.search) || [])[1] || '').split(',').map(decodeURIComponent).filter(Boolean);
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const App = () => {
  const [data, setData] = useState<any>({}); // todo: fix type
  const [precinctMeta, setPrecinctMeta] = useState<any>({}); // todo: fix type
  const contests: string[] = Object.keys(data || {}).slice(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Ensure we have all neighborhoods preserved.
  const neighborhoods: Set<string> = new Set();
  for (const precinct of Object.values(precinctMeta || {})) {
    neighborhoods.add((precinct as any).doeNeighborhood);
  }

  useEffect(() => {
    (async () => {
      setData(await (await fetch(`https://elections.universe.app/data.json?q=${Math.floor(Math.random() * 10000000)}`)).json());
      setPrecinctMeta(await (await fetch('./precincts.json')).json());
      setIsLoading(false)
    })()
  }, []);

  const [contestIdx, setSelectedContest] = useState<number>(parseInt(getSearchParam(/e=(\d+)/gi)[0]));
  const [mapType, setMapType] = useState<MapType>(ensureMapType(getSearchParam(/t=([^&]+)/gi)[0]));
  const [filterType, setFilterType] = useState(((/f=([^&]+)/gi).exec(window.location.search) || [])[0] || 'INDIVIDUAL');
  const [assemblyDistricts, setAssemblyDistricts] = useState<Array<string>>(getSearchParam(/a=([^&]+)/gi));
  const [supervisorDistricts, setSupervisorDistricts] = useState<Array<string>>(getSearchParam(/s=([^&]+)/gi));
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<Array<string>>(getSearchParam(/n=([^&]+)/gi));
  const [activePct, setActivePct] = useState<string | null>(null);
  const [activeRunoff, setActiveRunoff] = useState<number>(0);
  const [selectedCandidates, setSelectedCandidates] = useState<Array<string>>(getSearchParam(/c=([^&]+)/gi));

  const selectedContest = contests[contestIdx];
  useEffect(() => {
    if (!data || isLoading) { return; }
    if (!selectedContest) {
      setSelectedContest(0);
    }
    else {
      setActiveRunoff(Math.max(0, (data[selectedContest].__META__.ranks || 0) - 1));
    }
  }, [isLoading, data, selectedContest]);

  const candidateTotals: { [key: string]: {} } = {};
  const values: number[] = [];
  const heat: { [key: string]: {[key: string]: any } } = {};
  const contestData = data?.[selectedContest] || {};
  const partyRegistration: { [key: string]: {} } = {};
  const PCTSHEAT: { [key: string]: {} } = {};
  const candidateSet = new Set<string>();

  let registration = 0;
  let totalVotes = 0;
  let candidates = selectedCandidates;

  if (data && precinctMeta) {
    if (activePct) { contestData[activePct] = contestData[activePct] || { turnout: {}, 0: {} }; }
    for (let pctName of [...new Set([...Object.keys(contestData), ...Object.keys(precinctMeta)])]) {
      if (pctName === '__META__') { continue; }

      if (activePct && pctName !== activePct) { continue; }

      contestData[pctName] = contestData[pctName] || { turnout: {}, 0: {} };

      if (selectedNeighborhoods.length > 0 && !selectedNeighborhoods.includes(precinctMeta?.[pctName]?.doeNeighborhood)) {
        continue;
      }

      // Skip precincts outside our selected assembly districts.
      if (assemblyDistricts.length > 0) {
        if (!assemblyDistricts.includes('AD17') && (pctName[0] === '7') || (pctName[0] === '1' && parseInt(pctName[2]) >= 4)) {
          continue;
        }
        if (!assemblyDistricts.includes('AD19') && (pctName[0] === '9') || (pctName[0] === '1' && parseInt(pctName[2]) < 4)) {
          continue;
        }
      }

      // Skip precincts outside our selected supervisor districts.
      if (supervisorDistricts.length > 0) {
        if (!supervisorDistricts.includes('SD1') && (pctName[1] === '1' && pctName[0] !== '1')) { continue; }
        if (!supervisorDistricts.includes('SD2') && (pctName[1] === '2' && pctName[0] !== '1')) { continue; }
        if (!supervisorDistricts.includes('SD3') && (pctName[1] === '3' && pctName[0] !== '1')) { continue; }
        if (!supervisorDistricts.includes('SD4') && (pctName[1] === '4' && pctName[0] !== '1')) { continue; }
        if (!supervisorDistricts.includes('SD5') && (pctName[1] === '5' && pctName[0] !== '1')) { continue; }
        if (!supervisorDistricts.includes('SD6') && (pctName[1] === '6' && pctName[0] !== '1')) { continue; }
        if (!supervisorDistricts.includes('SD7') && (pctName[1] === '7' && pctName[0] !== '1')) { continue; }
        if (!supervisorDistricts.includes('SD8') && (pctName[1] === '8' && pctName[0] !== '1')) { continue; }
        if (!supervisorDistricts.includes('SD9') && (pctName[1] === '9' && pctName[0] !== '1')) { continue; }
        if (!supervisorDistricts.includes('SD10') && (pctName[1] === '0' && pctName[0] !== '1')) { continue; }
        if (!supervisorDistricts.includes('SD11') && (pctName[0] === '1')) { continue; }
      }

      const pct: { [key: string]: any } = contestData[pctName];
      let pctPcts: { [key: string]: number } = PCTSHEAT[pctName] = {};
      let totalPctVotes = pct?.turnout?.all || 0;
      let totalPctReg = precinctMeta[pctName] && precinctMeta[pctName]?.registration[contestData?.__META__?.party || 'all'];

      // Open primaries in SF. Is this always true?
      if (contestData?.__META__?.party !== 'all') {
        totalPctReg += precinctMeta[pctName]?.registration['npp'] || 0;
      }

      for (const candidateName of (contestData?.__META__?.candidates || [])) {
        pct[activeRunoff] = pct[activeRunoff] || {};
        pct[activeRunoff][candidateName] = pct[activeRunoff][candidateName] || 0;
      }

      if (filterType === 'INDIVIDUAL') {
        totalVotes += totalPctVotes;
        registration += totalPctReg || 0;
      }

      if (mapType === 'TURNOUT') {
        candidateTotals.TOTAL = (candidateTotals.TOTAL || 0) + (totalPctReg || 0);
        for (let party of Object.keys(pct?.turnout || {})) {
          if (party === 'all') { continue }
          candidateSet.add(party);
          pctPcts[party] = (pct?.turnout[party] || 0) / (precinctMeta[pctName]?.registration?.[party] || 1);
          candidateTotals[party] = (candidateTotals[party] || 0) + (pct.turnout[party] || 0);
          partyRegistration[party] = (partyRegistration[party] || 0) + (precinctMeta[pctName]?.registration[party] || 0)
          values.push(pctPcts[party]); // need a NaN check here
        }
      } else {
        candidateTotals.TOTAL = (candidateTotals.TOTAL || 0) + (totalPctVotes || 0);

        for (let candidateName of Object.keys(pct[activeRunoff] || {})) {
          if (candidateName === 'TOTAL' || candidateName === 'turnout') { continue }

          if (filterType !== 'INDIVIDUAL' && candidates.indexOf(candidateName) !== -1) {
            totalVotes += (pct[activeRunoff][candidateName] || 0);
            registration += (pct[activeRunoff][candidateName] || 0);
          }

          candidateSet.add(candidateName);
          candidateTotals[candidateName] = (candidateTotals[candidateName] || 0) + (pct[activeRunoff][candidateName] || 0);
          pctPcts[candidateName] = pct[activeRunoff][candidateName] / totalPctVotes;
          if (mapType !== 'HOTSPOT') { values.push(pctPcts[candidateName]); }
        }
      }
    }

    candidates = selectedCandidates.length && candidateSet.has(selectedCandidates[0]) ? selectedCandidates : [[...candidateSet].sort((a, b) => {
      return candidateTotals[a] > candidateTotals[b] ? -1 : 1;
    })[0]].filter(Boolean);

    if (!isLoading) {
      !selectedCandidates.length && candidates[0] && setSelectedCandidates([candidates[0]]);

      if (mapType !== 'SUPPORT' && mapType !== 'WINLOSE' && filterType === 'HEADTOHEAD') {
        setFilterType('INDIVIDUAL');
        setSelectedCandidates([selectedCandidates[0]]);
      }

      else if (mapType !== 'TURNOUT' && selectedContest && selectedCandidates.length && data[selectedContest]?.__META__?.candidates?.indexOf(selectedCandidates[0]) === -1) {
        setSelectedCandidates([]);
      }

      const qsCon = contests.indexOf(selectedContest) ? `e=${contests.indexOf(selectedContest)}` : '';
      const qsCan = selectedCandidates.length > 0 && Object.getOwnPropertyNames(candidateTotals).indexOf(selectedCandidates[0]) > -1 ? `c=${[...candidates].join(',')}` : '';
      const qsSup = supervisorDistricts.length ? `s=${[...supervisorDistricts].join(',')}` : '';
      const qsAss = assemblyDistricts.length ? `a=${[...assemblyDistricts].join(',')}` : '';
      const qsNei = selectedNeighborhoods.length ? `n=${[...selectedNeighborhoods].join(',')}` : '';
      const qsTyp = mapType === 'SUPPORT' ? null : `t=${mapType}`;
      const qsFTyp = filterType === 'INDIVIDUAL' ? null : `f=${filterType}`
      const params =  [qsTyp, qsFTyp, qsCon, qsCan, qsSup, qsAss, qsNei].filter(Boolean).join('&');
      const url = `${window.location.pathname}${params ? '?' : ''}${params}`;
      window.history.replaceState({}, '', url);
    }

    for (let pctName of Object.keys(contestData)) {
      for(let candidate of candidates){
        if (pctName === '__META__') { continue; }
        let pctPcts: { [key: string]: number } = PCTSHEAT[pctName];
        if (!pctPcts) { continue; }
        const vals = Object.values(pctPcts).filter((n) => typeof n === 'number' && !isNaN(n)).filter(Boolean) as number[];
        const winners = new Set(vals.sort().slice(contestData.__META__.seats * -1));
        heat[pctName] = [pctPcts[candidate], Math.min(...vals), Math.max(...vals), winners.has(pctPcts[candidate])];
        !isNaN(pctPcts[candidate]) && values.push(pctPcts[candidate]);
      }
    }
  }

  let precinctStats = `${numberWithCommas(totalVotes)}/${numberWithCommas(registration)} (${((totalVotes / (registration || 1)) * 100).toFixed(2)}%) turnout`;
  if (activePct) {
    precinctStats = `PCT ${activePct}: ${precinctStats}`;
  }
  if (activePct && contestData[activePct] && heat && heat[activePct]) {
    if (mapType === 'TURNOUT') {
      for(let selectedCandidate of selectedCandidates){
        console.log(contestData[activePct].turnout, precinctMeta[activePct].registration, selectedCandidate)
        precinctStats = `PCT ${activePct}: ${contestData[activePct].turnout[selectedCandidate] || 0}/${precinctMeta[activePct].registration[selectedCandidate] || 0} (${((heat[activePct][0] || 0) * 100).toFixed(2) + '%'})`;
      }
    }
    else if (filterType !== 'INDIVIDUAL') {
      let totalVote = 0;
      for(let selectedCandidate of selectedCandidates) {
        totalVote += contestData[activePct][activeRunoff][selectedCandidate];
      }
      precinctStats = `PCT ${activePct}: ${contestData[activePct][activeRunoff][selectedCandidates[0]] || 0} vs ${contestData[activePct][activeRunoff][selectedCandidates[1]] || 0}`;
    }
    else {
      for(let selectedCandidate of selectedCandidates){
        precinctStats = `PCT ${activePct}: ${contestData[activePct][activeRunoff][selectedCandidate] || 0}/${precinctMeta[activePct].registration.all || 0} (${((heat[activePct][0] || 0) * 100).toFixed(2) + '%'})`;
      }
    }
  }

  return (
    <div id="main">
      <h1 className="title">{RACE_NAME}</h1>
      <a href="https://universe.app"><img src={logo} alt="Universe Logo" className="logo" /></a>
      <Map
        selectedCandidates={candidates}
        contestData={contestData}
        mapType={mapType}
        HEAT={heat}
        precinctMeta={precinctMeta}
        values={values}
        setPrecinctStats={setActivePct}
        precinct={activePct}
      />
      <div className="padding" />
      <Panel
        contests={contests}
        neighborhoods={neighborhoods}
        mapType={mapType}
        setMapType={setMapType}
        assemblyDistricts={assemblyDistricts}
        setAssemblyDistricts={setAssemblyDistricts}
        supervisorDistricts={supervisorDistricts}
        setSupervisorDistricts={setSupervisorDistricts}
        selectedNeighborhoods={selectedNeighborhoods}
        setSelectedNeighborhoods={setSelectedNeighborhoods}
        selectedContest={contestIdx}
        setSelectedContest={setSelectedContest}
        candidateTotals={candidateTotals}
        selectedCandidates={candidates}
        setSelectedCandidates={setSelectedCandidates}
        registration={registration}
        totalVotes={totalVotes}
        precinctStats={precinctStats}
        filterType={filterType}
        setFilterType={setFilterType}
        numSeats={(selectedContest && data[selectedContest]?.__META__?.seats) || 1}
        numRunoffs={(selectedContest && data[selectedContest]?.__META__?.ranks) || 0}
        activeRunoff={activeRunoff}
        setActiveRunoff={setActiveRunoff}
      >
        <h1 className="title">{RACE_NAME}</h1>
      </Panel>
    </div>
  );
}

export default App;
