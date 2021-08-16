import React, { Fragment, UIEvent, useState } from 'react';
import './Panel.css';
import { MAP_TYPE, ASSEMBLY_DISTRICTS, SUPERVISOR_DISTRICTS, NAME_MAP, FILTER_TYPE, isEligibleForFilter } from './constants'
import Checkbox from '../common/Checkbox'
import SocialSubmitForm from './SocialSubmitForm';
import { MapType } from '../types';

type PanelProps = {
  contests: string[],
  neighborhoods: Set<string>,
  mapType: MapType,
  // erica TODO: fix these types
  setMapType: any,
  assemblyDistricts: string[],
  setAssemblyDistricts: any,
  supervisorDistricts: string[],
  setSupervisorDistricts: any,
  selectedNeighborhoods: string[],
  setSelectedNeighborhoods: any,
  selectedContest: number,
  setSelectedContest: any,
  candidateTotals: any,
  selectedCandidates: string[],
  setSelectedCandidates: any,
  registration: number,
  totalVotes: number,
  precinctStats: string,
  filterType: string,
  setFilterType: any,
  numRunoffs: number;
  activeRunoff: number;
  setActiveRunoff: (n: number) => void;
  numSeats: number;
  children: JSX.Element | JSX.Element[];
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const ToggleButton = ({ value, state, stateSetter, name }: any) => {
  const handleMultiSelect = (value: any, state: Array<any>, setState: Function) => {
    const updatedState = state.includes(value) ? state.filter((x: any) => x !== value) : [...state, value]
    setState(updatedState)
  }
  const classNames = "toggleButton" + (state.includes(value) ? ' toggleButton__open' : '');
  return (
    <div className={classNames} onClick={() => handleMultiSelect(value, state, stateSetter)}>
      {name as string}
    </div>
  )
};
let coolDown: number | false = false;
// erica: would love to figure out a cleaner way to pass all this stuff into the panel! d
const Panel = ({ contests, neighborhoods, mapType, setMapType,
  assemblyDistricts, setAssemblyDistricts, supervisorDistricts, setSupervisorDistricts,
  selectedNeighborhoods, setSelectedNeighborhoods, selectedContest, setSelectedContest, candidateTotals, selectedCandidates,
  setSelectedCandidates, registration, totalVotes, precinctStats, setFilterType, filterType,
  activeRunoff, setActiveRunoff, numRunoffs, numSeats, children }: PanelProps) => {
  const [showSocialBar, setShowSocialBar] = useState(false);
  const [activeTab, setActiveTab] = useState('candidates');

  function onScroll(evt: UIEvent) {
    const el = evt.target as HTMLElement;
    if (coolDown) { return; }
    coolDown = window.setTimeout(() => coolDown = false, 50);
    const count = el.children.length;
    const panelWidth = (el.scrollWidth / count);
    const ratio = el.scrollLeft / panelWidth;
    const pos = el.scrollLeft - (Math.floor(ratio) * panelWidth) < (panelWidth / 2);
    const active = Math.max(0, Math.min(count - 1, pos ? Math.floor(ratio) : Math.ceil(ratio)));
    setActiveTab(active ? 'turfs' : 'candidates');
  }

  function scrollTo(num: number) {
    const el = document.getElementById('tab-panel')
    if(!el) { return; }
    el.scrollTo({ left: num * el.scrollWidth, behavior: 'smooth' });
  }

  const handleFilterTypeChange = (event: any) => {
    const target = event.target
    setFilterType(target.value)
    setSelectedCandidates([]) //Clear candidate selection
  }
  const handleMapTypeChange = (event: any) => {
    const target = event.target;
    setMapType(target.value)
    if (!showSocialBar) {
      setShowSocialBar(!showSocialBar)
    }
  }

  const handleCandidateSelection = (candidate: string) => {
    if (selectedCandidates.indexOf(candidate) === -1) {
      filterType === 'HEADTOHEAD' ? setSelectedCandidates([selectedCandidates.pop(), candidate]) :  setSelectedCandidates([candidate])
    } else {
      const selectedCandidatesWithoutCandidate = selectedCandidates.filter(selectedCandidate => { return selectedCandidate !== candidate })
      setSelectedCandidates(selectedCandidatesWithoutCandidate)
    }
  }

  const candidateSet = Object.keys(candidateTotals || {});
  const candidates = candidateSet.sort((a, b) => {
    return candidateTotals[a] > candidateTotals[b] ? -1 : 1;
  });
  const roundTotals = candidateTotals.TOTAL;
  debugger;
  return (
    <div className="panelContainer">
      <h1 id="touchPad">{precinctStats || 'Nov 3rd 2020 San Francisco Primary'}</h1>
      <div className="panelContent">

        {children}
        <SocialSubmitForm showSocialBar={showSocialBar} />

        <label className="map__filter-label map__filter-label--race" htmlFor="campaign-dropdown">Race:</label>
        <select value={selectedContest} onChange={e => { debugger; setSelectedContest(e.currentTarget.value) }} id="campaign-dropdown">
          {contests.map((contest, idx) => <option key={idx} value={idx}>{contest}</option>)}
        </select>

        <label className="map__filter-label map__filter-label--map-type" htmlFor="map-type">Map Type:</label>
        <div id="map-type" className="toggle">
          {MAP_TYPE.map((map, index) => {
            const { value, copy, id } = map
            let labelClass = ''

            if (index === 0) { //TODO: Ruth figure out how to do this in a less hacky way
              labelClass = 'toggle__label-first'
            } else if (index === MAP_TYPE.length - 1) {
              labelClass = 'toggle__label-last'
            }

            return (
              <Fragment key={value}>
                <input onChange={handleMapTypeChange} checked={value === mapType} type="radio" value={value} id={id} name="map-type" />
                <label className={labelClass} htmlFor={id}>{copy}</label>
              </Fragment>
            )
          })}
        </div>

        {isEligibleForFilter(mapType) &&
        <div id="filter-type" className="toggle filter__sub-type">
          <input onChange={handleFilterTypeChange} checked={'INDIVIDUAL' === filterType} type="radio" value='INDIVIDUAL' id="filter-type-individual" name="filter-type" />
          <label className='toggle__label-first' htmlFor="filter-type-individual">Individual<span>Pick One</span></label>
          <input onChange={handleFilterTypeChange} checked={'HEADTOHEAD' === filterType} type="radio" value='HEADTOHEAD' id='filter-type-head-to-head' name="filter-type" />
          <label className='toggle__label-last' htmlFor='filter-type-head-to-head'>Head to Head<span>Pick Two to Compare</span></label>
        </div>}

        {numRunoffs ? <div id="filter-type" className="toggle">
          <div className="filter__runoff-label">Runoff:</div>
          {new Array(numRunoffs).fill(1).map((_,idx, arr) => {
            return (<Fragment key={idx}>
              <input onChange={() => setActiveRunoff(idx)} checked={activeRunoff === idx} type="radio" value={idx} id={`filter-runoff-${idx}`} name="filter-runoff" />
              <label className='toggle__label' htmlFor={`filter-runoff-${idx}`}>{idx + 1 === arr.length ? 'Final' : idx + 1}</label>
            </Fragment>);
          })}
        </div> : undefined}

        <ul className="tabset">
          <li><button className={`tab ${activeTab === 'candidates' ? 'tab--active' : ''}`} onClick={_ => scrollTo(0)}>Candidates</button></li>
          <li><button className={`tab ${activeTab === 'turfs' ? 'tab--active' : ''}`} onClick={_ => scrollTo(100)}>Turfs</button></li>
        </ul>

        <section className="tabs" onScroll={onScroll} id="tab-panel">
          <div>
            <table className="map__candidates">
              <thead>
                <tr><th></th><th>Place</th><th id="table-name">{mapType === 'TURNOUT' ? 'Party' : 'Candidate'}</th><th>Votes</th><th>Percent</th></tr>
              </thead>
              <tbody id="election-results">
                {candidates.map((c, i) => {
                  if (c === 'TOTAL' || c.length === 1) {
                    return null;
                  }
                  const percent = ((candidateTotals[c] || 0) / (roundTotals || 0) * 100);
                  // const prevValue = (activeRunoff > 0 && candidateTotals[activeRunoff - 1]?.[c]) ? candidateTotals[activeRunoff - 1][c] : 0;
                  const currentValue = candidateTotals[c];
                  return (
                    <tr key={i} className={`${(i === numSeats) ? 'final-seat' : ''} ${' ' /*(currentValue - prevValue) === 0 ? 'table__cut' : ''*/}`} onClick={() => handleCandidateSelection(c)}>
                      <td><Checkbox checked={selectedCandidates.indexOf(c) > -1} onChange={() => handleCandidateSelection(c)} /></td>
                      <td>{i}</td>
                      <td id="table-name">{NAME_MAP[c] || c}</td>
                      <td>
                        {numberWithCommas(currentValue)}
                        {/* <span className="table__increase">{(prevValue && currentValue && currentValue - prevValue) ? ` +${currentValue - prevValue}` : ''}</span> */}
                      </td>
                      <td>{(isNaN(percent) ? '0' : percent.toFixed(2)) + '%'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <label className="map__filter-label" htmlFor="campaign-dropdown">Assembly District</label>
            <div className="wrap">
              {ASSEMBLY_DISTRICTS.map(n => <ToggleButton state={assemblyDistricts} stateSetter={setAssemblyDistricts} value={n.value} name={n.name} key={n.name} />)}
            </div>
            <label className="map__filter-label" htmlFor="campaign-dropdown">Supervisor District</label>
            <div className="wrap">
              {SUPERVISOR_DISTRICTS.map(n => <ToggleButton state={supervisorDistricts} stateSetter={setSupervisorDistricts} name={n.name} value={n.value} key={n.name} />)}
            </div>
            <label className="map__filter-label" htmlFor="campaign-dropdown">Neighborhoods</label>
            <div className="wrap">
              {Array.from(neighborhoods).map(n => <ToggleButton state={selectedNeighborhoods} stateSetter={setSelectedNeighborhoods} value={n} name={n} key={n} />)}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default Panel;
