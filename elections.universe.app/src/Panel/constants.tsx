export const MAP_TYPE = [
  // {
  //   value: 'TURNOUT',
  //   copy: 'Turnout',
  //   id: 'map-type-turnout'
  // },
  {
    value: 'WINLOSE',
    copy: 'Win / Lose',
    id: 'map-type-winlose'
  },
  {
    value: 'SUPPORT',
    copy: 'Support',
    id: 'map-type-support'
  },
  {
    value: 'HOTSPOT',
    copy: 'Hotspot',
    id: 'map-type-hotspot'
  }
]

export const isEligibleForFilter = (mapType: string) => mapType === 'SUPPORT' || mapType === 'WINLOSE'
export const FILTER_TYPE = [
  {
    value: 'INDIVIDUAL',
    copy: 'Individual',
    id: 'filter-type-individual'
  },
  {
    value: 'HEADTOHEAD',
    copy: 'Head to Head',
    id: 'filter-type-head-to-head'
  },
]
export const ASSEMBLY_DISTRICTS = [
  {
    name: 'AD 17',
    value: 'AD17'
  },
  {
    name: 'AD 19',
    value: 'AD19'
  },
];

export const SUPERVISOR_DISTRICTS = [
  {
    name: 'District 1',
    value: 'SD1'
  },
  {
    name: 'District 2',
    value: 'SD2'
  },
  {
    name: 'District 3',
    value: 'SD3'
  },
  {
    name: 'District 4',
    value: 'SD4'
  },
  {
    name: 'District 5',
    value: 'SD5'
  },
  {
    name: 'District 6',
    value: 'SD6'
  },
  {
    name: 'District 7',
    value: 'SD7'
  },
  {
    name: 'District 8',
    value: 'SD8'
  },
  {
    name: 'District 9',
    value: 'SD9'
  },
  {
    name: 'District 10',
    value: 'SD10'
  },
  {
    name: 'District 11',
    value: 'SD11'
  }
];

export const NAME_MAP: { [key: string]: string | undefined } = {
  dem: 'Democratic',
  rep: 'Republican',
  npp: 'No Party Preference',
  ai: 'American Independent',
  pf: 'Peace and Freedom',
  lib: 'Libertarian',
  grn: 'Green',
  misc: 'Other',
};
