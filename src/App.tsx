import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './page/homePage';
import { Test1Page } from './page/test1Page';
import { NotFoundPage } from './page/notFoundPage';
import { VideoTestPage } from './page/videoTestPage';
import { CameraInputTestPage } from './page/cameraInputTestPage';
import { QrReaderTestPage } from './page/qrReaderTestPage';
import { QrReaderTest2Page } from './page/qrReaderTest2Page';

function App() {
  
  // React.useEffect(() => {
  //   (async() => {
  //     if(navigator && navigator.serviceWorker){
  //       const registration = await navigator.serviceWorker.getRegistration();
  //       if(registration){
  //         registration.update();
  //       }
  //     }      
  //   })()
    
  // });
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/test1" element={<Test1Page />} />
        <Route path="/videoTest" element={<VideoTestPage />} />
        <Route path="/cameraInputTest" element={<CameraInputTestPage />} />
        <Route path="/qrReaderTest" element={<QrReaderTestPage />} />
        <Route path="/qrReaderTest2" element={<QrReaderTest2Page />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
