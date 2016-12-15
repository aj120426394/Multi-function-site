import React, {Component, PropTypes} from 'react';
import Weather from '../component/Weather';
import Traffic from '../component/Traffic';

class App extends Component {
  render() {
    return (
      <div className="row">
        <Weather className="col m6"/>
        <Traffic className="col m6"/>
      </div>
    );
  }
}

App.propTypes = {};
App.defaultProps = {};

export default App;
