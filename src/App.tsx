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
            <Link to="/" className="titlenavbar nav-link">PokeApp</Link>
          </Navbar.Text>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="mr-4">
            <Link to="/search" className="nav-link">Search Pokemon</Link>
          </Navbar.Text>
          <Navbar.Text className="mr-4">
            <Link to="/calc" className="nav-link">Type Calculator</Link>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
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
