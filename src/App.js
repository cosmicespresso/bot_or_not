import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import About from './About';


class App extends React.Component {
  render() {
    return (

      <BrowserRouter>

        <Switch>  
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </Switch>

      </BrowserRouter>
    );
  }
}

export default App;
