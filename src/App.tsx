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
import { QrReaderTest3Page } from './page/qrReaderTest3Page';
import { PwaProvider } from './lib/pwa';
import { LoginProvider } from './lib/auth';
import { NeedLoginPage } from './page/needLoginPage';

function App() {
  
  return (
    <PwaProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <LoginProvider>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/test1" element={<Test1Page />} />
            <Route path="/videoTest" element={<VideoTestPage />} />
            <Route path="/cameraInputTest" element={<CameraInputTestPage />} />
            <Route path="/qrReaderTest" element={<QrReaderTestPage />} />
            <Route path="/qrReaderTest2" element={<QrReaderTest2Page />} />
            <Route path="/qrReaderTest3" element={<QrReaderTest3Page />} />
            <Route path="/needLogin" element={<NeedLoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </LoginProvider>
      </BrowserRouter>
    </PwaProvider>
  );
}

export default App;
