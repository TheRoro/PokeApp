import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

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
      <Navbar expand="md" variant="dark" className="MyNavbar">
        <Navbar.Brand>
          <Navbar.Text className="text-light">
            <Link to="/" className="text-light titlenavbar">PokeApp</Link>
          </Navbar.Text>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="text-light mr-4">
            <Link to="/search" className="text-light">Search Pokemon</Link>
          </Navbar.Text>
          <Navbar.Text className="text-light mr-4">
            <Link to="/typecal/select" className="text-light">Type Calculator</Link>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route exact path="/typecal/select">
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
