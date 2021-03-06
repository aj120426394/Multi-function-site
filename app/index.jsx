import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRedirect, useRouterHistory, browserHistory} from 'react-router';
import App from './container/App';

import './scss/main.scss';
import './vendors/materialize/sass/materialize.scss';
import './vendors/materialize/js/bin/materialize';



function getBasePathForRoute() {
  var path = location.href;
  var pathParts = path.split('/');
  var topLevelPath = ['harry', 'cp'];
  var topLevelFound = false;
  var fixedPath = "";
  for(var i = pathParts.length-1; i >= 0; i--){
    var toCheck = pathParts[i];
    if(topLevelPath.indexOf(toCheck) >= 0){
      topLevelFound = true;
    } else if (topLevelFound == true) {
      fixedPath = pathParts.slice(0, i+1).join("/");
      break;
    }
  }
  if(fixedPath.length === 0){
    fixedPath = path;
  }
  return fixedPath.replace(/^https?:\/\/[^/]+/, "");
  // return '';
}


class Index extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path={`${getBasePathForRoute()}`} component={App} />
      </Router>
    )
  }
}

ReactDOM.render(
  <Index />
  , document.getElementById('root')
);
