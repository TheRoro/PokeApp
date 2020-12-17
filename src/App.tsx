import React from 'react';
import Home from './components/HomeComponent';
import TypeCalculator from './components/TypeCalculator';
import Navbar from 'react-bootstrap/Navbar';

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
            <Link to="/main" className="text-light">Search Pokemon</Link>
          </Navbar.Text>
          <Navbar.Text className="text-light mr-4">
            <Link to="/typecal" className="text-light">Type Calculator</Link>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route path="/typecal">
          <TypeCalculator/>
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
