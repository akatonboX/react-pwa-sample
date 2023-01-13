import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

//■Serevice Workerの有効化
// serviceWorkerRegistration.unregister();
serviceWorkerRegistration.register({
  onUpdate: (registration: ServiceWorkerRegistration) => {
    console.log("★serviceWorkerRegistration-onUpdate");
    //■新しいservice workerがある場合は、提供する。(取得しても、デフォルトではブラウザが閉じるまで、waiting状態になっている)
    if (registration.waiting) {
      console.log("★service workerの強制更新")
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }
});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
