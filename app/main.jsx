import React, { Component } from 'react';
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom';

import ThreeComponent from './Components/ThreeComponent.jsx';

// class Three extends Component {


render(
  <Router history={browserHistory}>
    <Route path="/" component={ThreeComponent} />
  </Router>,
  document.body
);
