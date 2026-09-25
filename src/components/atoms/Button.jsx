import './Button.css';

/**
 * Button — atom
 * Appears on: Home (Add drink), Add (Save/Cancel), Drinks (Add preset)
 * Props: variant, onClick, children
 */
function Button({ variant = 'primary', onClick, children, type = 'button' }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
