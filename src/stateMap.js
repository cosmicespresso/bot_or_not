
export const stateMap = [
  {
    headerText: 'Screen 1',
    main: 'Narrator',
    fieldTop: 'Ready to play some truth or dare?',
    fieldBottom: 'First, enter a cool name for yourself below:',
    input: 'MessageBar',
    inputText: ''
  },{
    headerText: 'Screen 2',
    main: 'Narrator',
    fieldTop: '',
    fieldBottom: 'Thanks! You are about to play 3 rounds of Truth or Dare with either a bot or a human. The goal of the game is to correctly tell the difference between the two. Before you start playing, you have 30 seconds to just chat with each other.',
    input: 'SingleButton',
    inputText: 'Chat'
  },{
    headerText: 'Screen 3',
    main: 'Chat',
    fieldTop: '',
    fieldBottom: '',
    input: 'MessageBar',
    inputText: ''
  },{
    headerText: 'Screen 4',
    main: 'Narrator',
    fieldTop: '',
    fieldBottom: 'OK enough chatting! Now its time to start playing. You have 3 rounds of truth or dare - choose them (and your words) wisely! ',
    input: 'SingleButton',
    inputText: 'Start round 1'
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