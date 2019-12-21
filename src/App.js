import React from 'react';
import ReactBotUI from './ReactBotUI';

import './App.css';

function App() {
  return (
    <div className="App">
      <ReactBotUI
          dialogHeightMax={350}
          isUserHidden={false}
          isVisible={true} 
          title={'Testing out Dialogflow'} />
    </div>
  );
}

export default App;
