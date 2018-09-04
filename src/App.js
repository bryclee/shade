import React, { Component } from 'react';
import Debug from './Debug';
import { geolocation } from './geolocation';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses: {}
    };
  }

  componentDidMount() {
    geolocation.init().then(({success, statuses}) => {
      if (!success) {
        // TODO: log something
        console.log('no success', statuses);
        return;
      }

      geolocation.subscribe(event => {
        console.log(event);
      });

      return this.setState({statuses});
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Debug status={this.state.statuses} />
        <p className="App-intro">
          test
        </p>
      </div>
    );
  }
}

export default App;
