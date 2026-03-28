import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';

import Splash from './components/Splash';
import MainLayout from './components/MainLayout';
import { 
  Home, 
  StockPrices, 
  SIPCalculator, 
  Portfolio, 
  Simulations, 
  Learn, 
  Puzzles, 
  AIReview, 
  Profile 
} from './pages';

import { LanguageProvider } from './LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Splash />} />
          
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="stocks" element={<StockPrices />} />
            <Route path="sip" element={<SIPCalculator />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="simulations" element={<Simulations />} />
            <Route path="learn" element={<Learn />} />
            <Route path="puzzles" element={<Puzzles />} />
            <Route path="ai-review" element={<AIReview />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
