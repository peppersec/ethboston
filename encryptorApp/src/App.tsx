import React from 'react';
import logo from './logo.svg';
import logoNu from './logoNu.png';
import './App.css';
import {Encryptor} from "./Encryptor";
import {Decryptor} from "./Decryptor";
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom'

function App() {
  return (
    <div className="App" >
      <header className="App-header">
        <img src={logoNu} className="App-logo" alt="logo" />
          <Router>
              <div style={{ maxWidth: "80vw" }}>
                  <nav>
                      <Link to="/">Encryptor</Link>
                        <br/>
                      <Link to="/decryptor">Decryptor</Link>
                  </nav>
                  <Switch>
                      <Route exact path="/" component={Encryptor} />
                      <Route exact path="/decryptor" component={Decryptor} />
                  </Switch>
              </div>
          </Router>
      </header>

    </div>
  );
}

export default App;
