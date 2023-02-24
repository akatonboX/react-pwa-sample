import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HomePage } from './page/homePage';
import { Test1Page } from './page/test1Page';
import { NotFoundPage } from './page/notFoundPage';
import { VideoTestPage } from './page/videoTestPage';
import { CameraInputTestPage } from './page/cameraInputTestPage';
import { QrReaderTestPage } from './page/qrReaderTestPage';
import { QrReaderTest2Page } from './page/qrReaderTest2Page';
import { QrReaderTest3Page } from './page/qrReaderTest3Page';
import { PwaProvider } from './lib/pwa';
import { LoginProvider } from './lib/auth';
import { NeedLoginPage } from './page/needLoginPage';
import { UrlTransitionBlockProvider } from './lib/urlTransitionBlock';
import { MessageboxProvider } from './lib/messagebox';

// function AppfotRouterv6() {
  
//   const router = createBrowserRouter(
//     createRoutesFromElements(
//       <>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/test1" element={<Test1Page />} />
//         <Route path="/videoTest" element={<VideoTestPage />} />
//         <Route path="/cameraInputTest" element={<CameraInputTestPage />} />
//         <Route path="/qrReaderTest" element={<QrReaderTestPage />} />
//         <Route path="/qrReaderTest2" element={<QrReaderTest2Page />} />
//         <Route path="/qrReaderTest3" element={<QrReaderTest3Page />} />
//         <Route path="/needLogin" element={<NeedLoginPage />} />
//         <Route path="*" element={<NotFoundPage />} />
//       </>
//     )
//   );
  
//   return (
//     <PwaProvider>
//       <LoginProvider>
//         <RouterProvider router={router} />
//       </LoginProvider>
//     </PwaProvider>
//   );
// }
function App() {

  
  return (
    <PwaProvider>
      <MessageboxProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <LoginProvider>
            <Switch>
              <Route path="/" component={HomePage} exact/>
              <Route path="/test1" component={Test1Page} exact/>
              <Route path="/videoTest" component={VideoTestPage} exact/>
              <Route path="/cameraInputTest" component={CameraInputTestPage} exact/>
              <Route path="/qrReaderTest" component={QrReaderTestPage} exact/>
              <Route path="/qrReaderTest2" component={QrReaderTest2Page} exact/>
              <Route path="/qrReaderTest3" component={QrReaderTest3Page} exact/>
              <Route path="/needLogin" component={NeedLoginPage} exact/>
              <Route path="/" component={NotFoundPage} />
            </Switch>
          </LoginProvider>
        </BrowserRouter>
      </MessageboxProvider>
    </PwaProvider>
  );
}
export default App;
