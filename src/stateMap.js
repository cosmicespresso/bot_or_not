
export const stateMap = [
  {
    step: 1,
    headerText: 'Truth or Dare Turing Test',
    main: 'Narrator',
    input: 'SingleButton'
  },{
    step: 2,
    headerText: 'Here is another header',
    main: 'ChatLog',
    input: 'MessageBar'
  },{
    step: 3,
    headerText: 'Truth or Dare Turing Test',
    main: 'Narrator',
    input: 'DoubleButton'
  },
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