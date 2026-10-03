import { createContext, useContext, useEffect, useState } from 'react';
import * as posseRepo from '../lib/posseRepo';

const PosseContext = createContext(null);

export function PosseProvider({ children }) {
  const [posse, setPosse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPosse() {
      setLoading(true);
      try {
        const data = await posseRepo.getAll();
        setPosse(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPosse();
  }, []);

  async function addPerson(name) {
    try {
      const data = await posseRepo.create(name);
      setPosse((prev) => [...prev, data]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function renamePerson(id, name) {
    try {
      const data = await posseRepo.update(id, { name });
      setPosse((prev) => prev.map((p) => (p.id === id ? data : p)));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function setDrinks(id, drinks) {
    try {
      const safeDrinks = Math.max(0, drinks);
      const data = await posseRepo.update(id, { drinks: safeDrinks });
      setPosse((prev) => prev.map((p) => (p.id === id ? data : p)));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function removePerson(id) {
    try {
      await posseRepo.remove(id);
      setPosse((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function clearPosse() {
    try {
      await posseRepo.removeAll();
      setPosse([]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  return (
    <PosseContext.Provider
      value={{ posse, loading, error, addPerson, renamePerson, setDrinks, removePerson, clearPosse }}
    >
      {children}
    </PosseContext.Provider>
  );
}

export function usePosse() {
  const ctx = useContext(PosseContext);
  if (!ctx) throw new Error('usePosse must be used inside PosseProvider');
  return ctx;
}