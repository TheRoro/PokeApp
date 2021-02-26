import React, {useEffect} from 'react';
import RNavBar from './Components/Navbar/ResponsiveNavbar';
import Home from './Components/Home/HomeComponent';
import TypeCalculator from './Components/Type-Calculator/TypeCalculator';
import SearchPokemon from './Components/Search-Pokemon/Search/Search';
import SearchMove from './Components/Search-Move/SearchMove';
import TeamBuilder from './Components/TeamBuilder/TeamBuilder';
import OlderVersions from './Components/Older-Versions/OlderVersions';
import './Assets/TypeColors.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';


function App() {

  useEffect(() => {
  }, [])

  return (
    <Router>
      <RNavBar/>
      <Switch>
        <Route path="/calc">
          <TypeCalculator/>
        </Route>
        <Route path="/search">
          <SearchPokemon/>
        </Route>
        <Route path="/move">
          <SearchMove/>
        </Route>
        <Route path="/teambuilder">
          <TeamBuilder/>
        </Route>
        <Route path="/older-versions">
          <OlderVersions/>
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;