import { useEffect, useState } from 'react';

const SHAPES = [
  { icon: '◆', size: 20, color: 'rgba(16,185,129,0.12)' },
  { icon: '◇', size: 14, color: 'rgba(16,185,129,0.08)' },
  { icon: '○', size: 24, color: 'rgba(16,185,129,0.06)' },
  { icon: '□', size: 16, color: 'rgba(16,185,129,0.10)' },
  { icon: '△', size: 18, color: 'rgba(16,185,129,0.07)' },
];

const FloatingShapes = ({ count = 6, className = '' }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => {
      const shape = SHAPES[i % SHAPES.length];
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: shape.size + Math.random() * 10,
        icon: shape.icon,
        color: shape.color,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 5,
      };
    });
    setItems(generated);
  }, [count]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute select-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            color: item.color,
            transform: 'translateY(0)',
            animation: `floatShape ${item.duration}s ease-in-out ${item.delay}s infinite`,
          }}
        >
          {item.icon}
        </span>
      ))}
      <style>{`
        @keyframes floatShape {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          25% { transform: translateY(-20px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(0) rotate(180deg); opacity: 0.3; }
          75% { transform: translateY(15px) rotate(270deg); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default FloatingShapes;
