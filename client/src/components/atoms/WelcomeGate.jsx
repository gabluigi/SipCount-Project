import { useState } from 'react';
import './WelcomeGate.css';

const SESSION_KEY = 'sipcount-welcomed';
const SITE_PASSWORD = 'admin';

function WelcomeGate({ children }) {
  const [status, setStatus] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true' ? 'unlocked' : 'locked';
    } catch {
      return 'storage-error';
    }
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (password !== SITE_PASSWORD) {
      setError('That password is incorrect. Please try again.');
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setError('');
      setStatus('unlocked');
    } catch {
      setError('Your browser could not save this session. Please enable session storage and try again.');
    }
  }

  if (status === 'unlocked') {
    return children;
  }

  return (
    <main className="welcome-gate">
      <section className="welcome-gate-card" aria-labelledby="welcome-title">
        <img className="welcome-gate-logo" src="/sipcountlogo.svg" alt="" />
        <h1 id="welcome-title">Welcome Back Louis!</h1>
        <p className="welcome-gate-brand">SipCount</p>

        {status === 'storage-error' ? (
          <p className="welcome-gate-error" role="alert">
            SipCount could not check this browser session. Please enable session storage and reload.
          </p>
        ) : (
          <form className="welcome-gate-form" onSubmit={handleSubmit}>
            <label htmlFor="welcome-password">Password</label>
            <input
              id="welcome-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'welcome-error' : undefined}
              required
              autoFocus
            />
            {error && <p className="welcome-gate-error" id="welcome-error" role="alert">{error}</p>}
            <button className="welcome-gate-submit" type="submit">Enter SipCount</button>
          </form>
        )}
      </section>
    </main>
  );
}

export default WelcomeGate;
