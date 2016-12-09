import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import {Router, Route, IndexRedirect, useRouterHistory, browserHistory} from 'react-router';
import App, {NotFound} from './components/app';

import './scss/main.scss';
import './vendors/materialize/js/bin/materialize';

// Import each of the images in the images folder.
const requireAll = (r) => {
  r.keys().forEach(r)
};
requireAll(
  require.context(
    "./assets/images",
    true,
    /.(jpg|JPG|png)/
  )
);


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
