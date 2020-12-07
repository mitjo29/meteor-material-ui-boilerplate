// import React from 'react';
// import { Meteor } from 'meteor/meteor';
// import { render } from 'react-dom';
// import App from '/imports/ui/App';
// import * as serviceWorker from '/imports/ui/serviceWorker';

// Meteor.startup(() => {
//   render(<App/>, document.getElementById('react-target'));
// });

// serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from '/imports/ui/serviceWorker';
import App from '/imports/ui/App';

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('react-target'));

serviceWorker.unregister();