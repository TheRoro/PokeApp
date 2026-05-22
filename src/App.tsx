import React from 'react';
import RNavBar from './Components/Navbar/ResponsiveNavbar';
import Home from './Components/Home/HomeComponent';
import TypeCalculator from './Components/Type-Calculator/TypeCalculator';
import SearchPokemon from './Components/Search-Pokemon/Search/Search';
import SearchMove from './Components/Search-Move/SearchMove';
import TeamBuilder from './Components/TeamBuilder/TeamBuilder';
import OlderVersions from './Components/Older-Versions/OlderVersions';
import './Assets/TypeColors.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <RNavBar />
      <Routes>
        <Route path="/calc/*" element={<TypeCalculator />} />
        <Route path="/search/*" element={<SearchPokemon />} />
        <Route path="/move/*" element={<SearchMove />} />
        <Route path="/teambuilder" element={<TeamBuilder />} />
        <Route path="/older-versions" element={<OlderVersions />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
