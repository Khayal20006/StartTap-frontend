import { useRef, useState } from 'react';

const GlowCard = ({ children, className = '', onClick = null }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className={`relative group ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hover ? 1 : 0,
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(16,185,129,0.08), transparent 60%)`,
        }}
      />
      <div
        className="absolute -inset-px rounded-sm transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: hover ? 0.5 : 0,
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(16,185,129,0.3), transparent 50%)`,
          filter: 'blur(4px)',
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlowCard;
