import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { sendToVercelAnalytics } from './vitals';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
      


//posthog import 
posthog.init('phc_WJbUKqxSngbuGXRp9txE32S6uRJzzkHheQaSHLRJaiY', {
  api_host:'https://us.i.posthog.com',
  person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
  autocapture: {
    dom_event_allowlist: ['click'], // DOM events from this list ['click', 'change', 'submit']
    url_allowlist: ['posthog.com./docs/.*'], // strings or RegExps
    // url_ignorelist can be used on its own, or combined with url_allowlist to further filter which URLs are captured
    url_ignorelist: ['posthog.com./docs/.*/secret-section/.*'], // strings or RegExps
    element_allowlist: ['button'], // DOM elements from this list ['a', 'button', 'form', 'input', 'select', 'textarea', 'label']
    css_selector_allowlist: ['[ph-autocapture]'], // List of CSS selectors
    element_attribute_ignorelist:['data-attr-pii="email"'], // List of element attributes to ignore
},
})

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PostHogProvider 
      apiKey={'phc_WJbUKqxSngbuGXRp9txE32S6uRJzzkHheQaSHLRJaiY'}
    > 
    <App />
    </PostHogProvider>
   
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(sendToVercelAnalytics);
