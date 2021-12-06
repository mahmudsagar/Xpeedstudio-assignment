import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import ScreenB from './Components/ScreenB/ScreenB';

function App() {
  return (
    <div className="px-3">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/screenB" element={<ScreenB />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
