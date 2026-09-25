import './EmptyState.css';

/** EmptyState — molecule. Appears on: Home, Monitoring, Drinks. Props: message */
function EmptyState({ message }) {
  return <div className="empty-state">{message}</div>;
}

export default EmptyState;
