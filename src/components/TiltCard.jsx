import { useRef, useState } from 'react';

const TiltCard = ({ children, className = '', onClick = null }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    setStyle({ transform: `perspective(600px) rotateX(${x}deg) rotateY(${y}deg)` });
  };

  const handleMouseLeave = () => {
    setStyle({});
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{ ...style, transition: 'transform 0.1s ease-out' }}
    >
      {children}
    </div>
  );
};

export default TiltCard;
