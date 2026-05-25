import { motion } from 'framer-motion';

const HeroIllustration = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[450px] md:max-w-[500px]">
        <defs>
          <linearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.08" />
          </linearGradient>
          <style>{`
            @keyframes spin-slow { to { transform: rotate(360deg); } }
            @keyframes spin-slower { to { transform: rotate(-360deg); } }
            .anim-spin { animation: spin-slow 30s linear infinite; transform-origin: 250px 250px; }
            .anim-spin-reverse { animation: spin-slower 25s linear infinite; transform-origin: 250px 250px; }
          `}</style>
        </defs>

        <circle cx="250" cy="250" r="180" fill="url(#glowGrad)" />
        <circle cx="250" cy="250" r="120" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.2" className="anim-spin" />
        <circle cx="250" cy="250" r="90" fill="none" stroke="#059669" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.15" className="anim-spin-reverse" />

        {[
          { x: 250, y: 80, label: 'İdeya', delay: 0 },
          { x: 370, y: 180, label: 'Komanda', delay: 0.3 },
          { x: 350, y: 340, label: 'Məhsul', delay: 0.6 },
          { x: 150, y: 340, label: 'Bazar', delay: 0.9 },
          { x: 130, y: 180, label: 'İnvestisiya', delay: 1.2 },
        ].map((node, i) => (
          <g key={i}>
            <motion.circle
              cx={node.x} cy={node.y} r="28"
              fill="rgba(16,185,129,0.08)"
              stroke="rgba(16,185,129,0.25)"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: node.delay + 0.5, duration: 0.3, ease: 'easeOut' }}
            />
            <circle cx={node.x} cy={node.y} r="12" fill="rgba(16,185,129,0.2)" />
            <circle cx={node.x} cy={node.y} r="4" fill="#10b981" opacity="0.8" />
            <motion.text
              x={node.x} y={node.y + 48}
              textAnchor="middle"
              fill="rgba(255,255,255,0.4)"
              fontSize="9"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: node.delay + 0.8, duration: 0.2 }}
              className="uppercase tracking-widest"
            >
              {node.label}
            </motion.text>
          </g>
        ))}

        {[
          [250, 80, 370, 180],
          [250, 80, 130, 180],
          [370, 180, 350, 340],
          [130, 180, 150, 340],
          [370, 180, 250, 250],
          [130, 180, 250, 250],
          [250, 250, 350, 340],
          [250, 250, 150, 340],
        ].map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={`l${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(16,185,129,0.08)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1 + i * 0.05, duration: 0.3 }}
          />
        ))}

        <motion.path
          d="M 80 420 L 120 390 L 160 400 L 200 360 L 240 370 L 280 320 L 320 330 L 360 280 L 400 290 L 420 260"
          stroke="rgba(16,185,129,0.3)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 2, duration: 0.6, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 80 430 L 120 400 L 160 415 L 200 380 L 240 390 L 280 340 L 320 355 L 360 300 L 400 315 L 420 280"
          stroke="rgba(16,185,129,0.1)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6, ease: 'easeInOut' }}
        />

        {[100, 180, 260, 340, 420].map((x, i) => (
          <motion.circle
            key={`d${i}`}
            cx={x} cy={420 - i * 30}
            r="2"
            fill="#10b981"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5 + i * 0.1, duration: 0.15 }}
          />
        ))}

        <motion.text
          x={250} y={470}
          textAnchor="middle"
          fill="rgba(16,185,129,0.15)"
          fontSize="8"
          fontWeight="500"
          fontFamily="Inter, sans-serif"
          className="uppercase tracking-[0.3em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.3 }}
        >
          StartTap Ecosystem
        </motion.text>
      </svg>
    </div>
  );
};

export default HeroIllustration;
