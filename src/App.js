import React from 'react';
import ReactBotUI from './ReactBotUI';

import './styles/App.css';

function App() {
  return (
    <div className="App">
      <ReactBotUI
          dialogHeightMax={350}
          title={'Truth or Dare Turing Test'} />
    </div>
  );
}

export default App;
