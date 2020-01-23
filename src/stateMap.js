export const stateMap = [
  {
    hdear: 'intro',
    main: 'chat',
    input: 'Message'
  }
];

export const findTimepointForMode = (stateMap, percent) => {
  for (let i = cMap.length - 1; i >= 0; i--) {
    if (percent >= cMap[i].fromPosition) {
      return cMap[i].timepoint;
    }
  }
  return cMap[0].timepoint;
};