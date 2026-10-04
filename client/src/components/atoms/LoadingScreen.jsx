import './LoadingScreen.css';

function LoadingScreen() {
  return (
    <main className="loading-screen" aria-busy="true">
      <div className="loading-screen-content" role="status" aria-live="polite">
        <img className="loading-screen-logo" src="/sipcountlogo.svg" alt="" />
        <h1>SipCount</h1>
        <p>Loading, please wait</p>
      </div>
    </main>
  );
}

export default LoadingScreen;
