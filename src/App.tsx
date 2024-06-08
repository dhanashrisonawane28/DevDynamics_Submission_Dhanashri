import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeveloperList from './components/DevloperList';
import DeveloperDetail from './components/DevloperDetail';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeveloperList />} />
        <Route path="/developer/:id" element={<DeveloperDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
