import React, { Component} from 'react';

declare global {
  interface Window { google: any; initMap: any; }
}

const PRECINCTS_GEOJSON_URL = 'https://cdn.universe.app/geojson/usa/06/75/precincts_2012.geojson';
const MAP_CENTER = { lat: 37.7650, lng: -122.4000, };
const INITIAL_ZOOM = 13;

function heatMapColorforValue(value: number) {
  var h = value * 240
  return "hsl(" + h + ", 100%, 50%)";
}

function hasTouch(): boolean {
  return 'ontouchstart' in document.documentElement
         || navigator.maxTouchPoints > 0
         || navigator.msMaxTouchPoints > 0;
}

interface Props {
  mapType: string,
  values: any,
  HEAT: any,
  selectedCandidates: string[],
  precinctMeta: any,
  contestData: any,
  setPrecinctStats: any,
  precinct: any,
}

interface State {
  map: google.maps.Map | null,
}

const disabledPcts = new Set();

class Map extends Component<Props, State> {
  cache: null | string = null;
  state = {
    map: null,
  }

  componentDidMount() {
    window.initMap = this.initMap.bind(this);

    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq_fAHf_uUBs9gXCAseIZVZl2shvHwGD0&callback=initMap"
    document.head.appendChild(script)
  }

  initMap() {
    const map: google.maps.Map = new window.google.maps.Map(document.getElementById('map'), {
      center: MAP_CENTER,
      zoom: INITIAL_ZOOM,
      disableDefaultUI: true,
      clickableIcons: false,
    });
    map.data.loadGeoJson(PRECINCTS_GEOJSON_URL);
    map.data.setStyle({
      fillColor: 'red',
      strokeOpacity: 1,
      strokeWeight: 2,
    });

    if (!hasTouch()) {
      // @ts-ignore
      map.data.addListener('mouseover', (event) => {
        const { mapType, HEAT, selectedCandidates, precinctMeta, contestData, setPrecinctStats } = this.props;
        const pct = event.feature.getProperty('prec_2012');
        if (disabledPcts.has(pct) || !(HEAT[pct] && HEAT[pct][0])) { setPrecinctStats(null); return }
        setPrecinctStats(pct);
      });

      // @ts-ignore
      map.data.addListener('mouseout', (event) => {
        const { setPrecinctStats } = this.props;
        setPrecinctStats(null);
      });
    }
    else {
      map.data.addListener('click', (event) => {
        const { mapType, HEAT, selectedCandidates, precinctMeta, contestData, setPrecinctStats } = this.props;
        const pct = event.feature.getProperty('prec_2012');
        if (disabledPcts.has(pct) || disabledPcts.size === 0) { setPrecinctStats(null); return; }
        setPrecinctStats(this.props.precinct && pct === this.props.precinct ? null : pct);
      });
    }

    const { mapType, values, HEAT } = this.props;
    const min = Math.min(...values) || 0;
    const max = Math.max(...values) || 1;

    map.data.setStyle(function(feature: { getProperty: (arg0: string) => any; }) {
      var pct = feature.getProperty('prec_2012');
      if (mapType === 'TURNOUT') {
        return {
          fillColor: (HEAT[pct] && HEAT[pct][0]) ? heatMapColorforValue((HEAT[pct][0] - 0) / (1 - 0)) : 'black',
          clickable: true,
        };
      }
      if (mapType === 'WINLOSE') {
        return {
          fillColor: (HEAT[pct] && HEAT[pct][0]) ? heatMapColorforValue(HEAT[pct][3] ? 1 : 0) : 'black',
          clickable: true,
        };
      }
      return {
        fillColor: (HEAT[pct] && HEAT[pct][0]) ? heatMapColorforValue((HEAT[pct][0] - min) / (max - min)) : 'black',
        clickable: true,
      };
    });

    this.setState({ map });
  }

  render() {
    const { map } = this.state;
    const { mapType, values, HEAT, precinct, selectedCandidates } = this.props;

    // @ts-ignore
    const update = JSON.stringify({ HEAT, mapType, selectedCandidates });
    if (this.cache !== update) {
      this.cache = update;
      const min = Math.min(...values.filter(Boolean));
      const max = Math.max(...values.filter(Boolean));
      disabledPcts.clear();
      map && (map as unknown as google.maps.Map).data.setStyle(function(feature: { getProperty: (arg0: string) => any; }) {
        var pct = feature.getProperty('prec_2012');
        (HEAT[pct] && HEAT[pct][0]) || disabledPcts.add(pct);
        if (mapType === 'TURNOUT') {
          return {
            fillColor: (HEAT[pct] && HEAT[pct][0]) ? heatMapColorforValue((HEAT[pct][0] - 0) / (1 - 0)) : 'black',
            clickable: true,
          };
        }
        if (mapType === 'WINLOSE') {
          return {
            fillColor: (HEAT[pct] && HEAT[pct][0]) ? heatMapColorforValue(HEAT[pct][3] ? 1 : 0) : 'black',
            clickable: true,
          };
        }

        // If is hotspot, and we risk having a 0 as a denominator, just show blue (happens when one pct is selected).
        if (mapType === 'HOTSPOT' && HEAT[pct] && HEAT[pct][0] && isNaN((HEAT[pct][0] - min) / (max - min))) {
          return {
            fillColor: (HEAT[pct] && HEAT[pct][0]) ? heatMapColorforValue(1) : 'black',
            clickable: true,
          };
        }

        return {
          fillColor: (HEAT[pct] && HEAT[pct][0]) ? heatMapColorforValue((HEAT[pct][0] - min) / (max - min)) : 'black',
          clickable: true,
        };
      });
    }


    return (
      <div id="map" />
    );
  }
}

export default Map;
