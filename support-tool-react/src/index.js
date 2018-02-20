import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

WebFont.load({
    google: {
        families: ['Roboto:300,400,700', 'sans-serif']
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root'));

registerServiceWorker();
