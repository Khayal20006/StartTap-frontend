import { motion } from 'framer-motion';

const NetworkGraph = ({ className = '' }) => {
  const nodes = [
    { x: 50, y: 50, r: 4, delay: 0 },
    { x: 80, y: 20, r: 3, delay: 0.1 },
    { x: 20, y: 80, r: 3, delay: 0.2 },
    { x: 90, y: 70, r: 4, delay: 0.3 },
    { x: 30, y: 30, r: 2, delay: 0.15 },
    { x: 70, y: 90, r: 3, delay: 0.25 },
    { x: 40, y: 60, r: 2, delay: 0.35 },
    { x: 85, y: 40, r: 2, delay: 0.4 },
    { x: 15, y: 45, r: 3, delay: 0.45 },
    { x: 60, y: 15, r: 2, delay: 0.3 },
  ];

  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} fill="none">
      {nodes.map((n, i) =>
        nodes.slice(i + 1).map((m, j) => {
          const dist = Math.sqrt((n.x - m.x) ** 2 + (n.y - m.y) ** 2);
          if (dist > 60) return null;
          return (
            <motion.line
              key={`${i}-${j}`}
              x1={n.x} y1={n.y} x2={m.x} y2={m.y}
              stroke="rgba(16,185,129,0.08)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: Math.random() * 0.5, duration: 0.5 }}
            />
          );
        })
      )}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r={n.r}
          fill="rgba(16,185,129,0.3)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: n.delay, duration: 0.3 }}
          whileHover={{ r: n.r * 2, fill: 'rgba(16,185,129,0.6)' }}
        />
      ))}
    </svg>
  );
};

export default NetworkGraph;
