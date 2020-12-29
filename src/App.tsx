import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import RNavBar from './Components/Navbar/ResponsiveNavbar';
import Home from './Components/Home/HomeComponent';
import TypeCalculator from './Components/Calculator/TypeCalculator';
import SearchPokemon from './Components/Search/SearchPokemon';

import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="pokeapp">
      <RNavBar/>
      <Switch>
        <Route path="/calc">
          <TypeCalculator/>
        </Route>
        <Route path="/search">
          <SearchPokemon/>
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </div>
  </Router>
  );
}

export default App;
