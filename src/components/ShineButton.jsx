const ShineButton = ({ children, className = '', ...props }) => (
  <button
    className={`group relative overflow-hidden ${className}`}
    {...props}
  >
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </button>
);

export default ShineButton;
