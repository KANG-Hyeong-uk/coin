/**
 * 메인 App 컴포넌트
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CryptoPortfolioPage, ChartPage } from './components/pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CryptoPortfolioPage />} />
        <Route path="/charts" element={<ChartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
