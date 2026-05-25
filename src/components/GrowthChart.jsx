import { motion } from 'framer-motion';

const GrowthChart = ({ className = '' }) => {
  const bars = [
    { h: 30, delay: 0, label: 'H1' },
    { h: 45, delay: 0.1, label: 'H2' },
    { h: 38, delay: 0.2, label: 'H3' },
    { h: 55, delay: 0.3, label: 'H4' },
    { h: 48, delay: 0.4, label: 'H5' },
    { h: 70, delay: 0.5, label: 'H6' },
    { h: 65, delay: 0.6, label: 'H7' },
    { h: 85, delay: 0.7, label: 'H8' },
    { h: 78, delay: 0.8, label: 'H9' },
    { h: 95, delay: 0.9, label: 'H10' },
    { h: 88, delay: 1.0, label: 'H11' },
    { h: 100, delay: 1.1, label: 'H12' },
  ];

  const barWidth = 100 / bars.length;

  return (
    <svg viewBox="0 0 120 100" className={`w-full h-full ${className}`}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <motion.line
        x1="0" y1="0" x2="0" y2="100"
        stroke="rgba(16,185,129,0.1)"
        strokeWidth="0.5"
      />

      {[0, 25, 50, 75, 100].map(y => (
        <motion.line
          key={y}
          x1="0" y1={100 - y} x2="120" y2={100 - y}
          stroke="rgba(16,185,129,0.05)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + y * 0.01 }}
        />
      ))}

      {bars.map((bar, i) => (
        <g key={i}>
          <motion.rect
            x={i * barWidth + 2}
            y={100}
            width={barWidth - 4}
            height={0}
            fill="url(#barGrad)"
            rx="1"
            initial={{ height: 0, y: 100 }}
            animate={{ height: bar.h, y: 100 - bar.h }}
            transition={{ delay: bar.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.rect
            x={i * barWidth + 2}
            y={100 - bar.h}
            width={barWidth - 4}
            height="1"
            fill="#10b981"
            opacity="0.4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: bar.delay + 0.3 }}
          />
        </g>
      ))}

      <motion.path
        d={`M 0 100 ${bars.map((b, i) => `L ${i * barWidth + barWidth / 2} ${100 - b.h}`).join(' ')}`}
        stroke="#10b981"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 1, ease: 'easeInOut' }}
      />
      <motion.path
        d={`M 0 100 ${bars.map((b, i) => `L ${i * barWidth + barWidth / 2} ${100 - b.h}`).join(' ')} L ${bars.length * barWidth} 100 Z`}
        fill="url(#barGrad)"
        opacity="0.1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 2, duration: 0.5 }}
      />
    </svg>
  );
};

export default GrowthChart;
