import { useState } from 'react';
import NavBar from '../components/organisms/NavBar';
import LoadingScreen from '../components/atoms/LoadingScreen';
import PosseRow from '../components/molecules/PosseRow';
import SpinWheel from '../components/organisms/SpinWheel';
import ScenarioPicker from '../components/organisms/ScenarioPicker';
import EmptyState from '../components/molecules/EmptyState';
import Button from '../components/atoms/Button';
import { usePosse } from '../context/PosseContext';
import './Games.css';

function Games() {
  const { posse, loading, error, addPerson, renamePerson, setDrinks, removePerson, clearPosse } = usePosse();
  const [newName, setNewName] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    addPerson(newName.trim());
    setNewName('');
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <>
        <NavBar />
        <main className="games-main">
          <p className="state state--error">{error}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="games-main">
        <h1>Drinking Games</h1>
        <p className="games-intro">
            Add your group below, spin the wheel to pick who's up, then pull a random
            scenario to keep the night moving.
        </p>

        <section className="games-section">
          <h2>The Posse</h2>

          <form className="posse-add-form" onSubmit={handleAdd}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Add a name…"
            />
            <Button variant="primary" type="submit">Add</Button>
          </form>

          {posse.length === 0 ? (
            <EmptyState message="No one in the posse yet." />
          ) : (
            <div className="posse-table">
              {posse.map((p) => (
                <PosseRow
                  key={p.id}
                  person={p}
                  onRename={renamePerson}
                  onSetDrinks={setDrinks}
                  onRemove={removePerson}
                />
              ))}
            </div>
          )}

          {posse.length > 0 && (
            <Button variant="ghost" onClick={clearPosse}>Clear posse</Button>
          )}
        </section>

        <section className="games-section">
          <h2>Spin the wheel</h2>
          <SpinWheel names={posse.map((p) => p.name)} />
        </section>

        <section className="games-section">
          <h2>Pick a scenario</h2>
          <ScenarioPicker />
        </section>
      </main>
    </>
  );
}

export default Games;