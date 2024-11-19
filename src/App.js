/*
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';  
import Search from './components/search';
import Naytokset from './components/naytokset'

 
function App() {
  return (
    <Router>
      <Routes>
        {     }
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <h1>The "best" movie page</h1>
              </header>
              
              <section className="App-section">
                <h2>Browse movies or see showings from Finnkino.</h2>
                <Link to="/Naytokset">
                  <button className="section-button">Search showings</button>
                </Link>
                <Link to="/Search">
                  <button className="section-button">Search movies</button>
                </Link>
              </section>
            </div>
          }
        />
 
        <Route path="/naytokset" element={<Naytokset/>} />
        <Route path="/search" element={<Search/>} />
 
      </Routes>
    </Router>
  );
}
 
export default App;


*/

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';  
import Search from './components/search';
import Naytokset from './components/naytokset';
import MovieDetails from './components/MovieDetails';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pääsivu */}
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <h1>The "best" movie page</h1>
              </header>
              
              <section className="App-section">
                <h2>Browse movies or see showings from Finnkino.</h2>
                <Link to="/naytokset">
                  <button className="section-button">Search showings</button>
                </Link>
                <Link to="/search">
                  <button className="section-button">Search movies</button>
                </Link>
              </section>
            </div>
          }
        />

        {/* Reitit komponenteille */}
        <Route path="/naytokset" element={<Naytokset />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App;