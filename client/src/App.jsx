import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EntriesProvider } from './context/EntriesContext';
import { PresetsProvider } from './context/PresetsContext';
import { PosseProvider } from './context/PosseContext';
import Home from './pages/Home';
import Add from './pages/Add';
import Monitoring from './pages/Monitoring';
import Drinks from './pages/Drinks';
import Games from './pages/Games';

function App() {
  return (
    <BrowserRouter>
      <EntriesProvider>
        <PresetsProvider>
          <PosseProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<Add />} />
              <Route path="/history" element={<Monitoring />} />
              <Route path="/drinks" element={<Drinks />} />
              <Route path="/games" element={<Games />} />
            </Routes>
          </PosseProvider>
        </PresetsProvider>
      </EntriesProvider>
    </BrowserRouter>
  );
}

export default App;