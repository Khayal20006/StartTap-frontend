import { useEffect, useRef, useState } from 'react';

const Marquee = ({ items = [], className = '', speed = 30 }) => {
  const [duplicated, setDuplicated] = useState([]);

  useEffect(() => {
    setDuplicated([...items, ...items, ...items]);
  }, [items]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="flex gap-10 md:gap-16 items-center"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          width: 'max-content',
        }}
      >
        {duplicated.map((item, i) => (
          <span
            key={i}
            className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/20 whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
