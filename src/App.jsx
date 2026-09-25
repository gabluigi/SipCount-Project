import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EntriesProvider } from './context/EntriesContext';
import { PresetsProvider } from './context/PresetsContext';
import Home from './pages/Home';
import Add from './pages/Add';
import Monitoring from './pages/Monitoring';
import Drinks from './pages/Drinks';

function App() {
  return (
    <EntriesProvider>
      <PresetsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/history" element={<Monitoring />} />
            <Route path="/drinks" element={<Drinks />} />
          </Routes>
        </BrowserRouter>
      </PresetsProvider>
    </EntriesProvider>
  );
}

export default App;
