import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const AnimatedCounter = ({ from = 0, to = 100, suffix = '', prefix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.6 },
      });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={controls}
    >
      {prefix && <span className="opacity-60">{prefix}</span>}
      {suffix && <span className="opacity-60">{suffix}</span>}
    </motion.div>
  );
};

export default AnimatedCounter;
