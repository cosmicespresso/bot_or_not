
export const stateMap = [
  {
    headerText: 'Screen 1',
    main: 'Narrator',
    input: 'SingleButton'
  },{
    headerText: 'Screen 2',
    main: 'ChatLog',
    input: 'MessageBar'
  },{
    headerText: 'Screen 3',
    main: 'Narrator',
    input: 'DoubleButton'
  },{
    headerText: 'Screen 4',
    main: 'ChatLog',
    input: 'MessageBar'
  },{
    headerText: 'Screen 5',
    main: 'Narrator',
    input: 'SingleButton'
  }
];


// export const findMainAtStep = (stateMap) => {
//   for (let i = cMap.length - 1; i >= 0; i--) {
//     return cMap[i].main;
//   }
//   return cMap[0].main;
// };

// export const findTimepointForMode = (stateMap, percent) => {
//   for (let i = cMap.length - 1; i >= 0; i--) {
//     if (percent >= cMap[i].fromPosition) {
//       return cMap[i].timepoint;
//     }
//   }
//   return cMap[0].timepoint;
// };