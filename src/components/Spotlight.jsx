import { useRef, useState } from 'react';

const Spotlight = ({ className = '' }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    if (!visible) setVisible(true);
  };

  const handleMouseLeave = () => setVisible(false);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <div
        className="absolute w-[400px] md:w-[600px] h-[400px] md:h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300"
        style={{
          left: pos.x,
          top: pos.y,
          opacity: visible ? 0.08 : 0,
          background: 'radial-gradient(circle at center, #10b981, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
};

export default Spotlight;
