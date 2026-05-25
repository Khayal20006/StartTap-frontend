import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const RevealText = ({ children, className = '', delay = 0, as = 'span' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  const Comp = as === 'h1' ? 'h1' : as === 'h2' ? 'h2' : as === 'h3' ? 'h3' : as === 'p' ? 'p' : 'span';

  return (
    <Comp ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: '100%', opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </Comp>
  );
};

const RevealStagger = ({ children, className = '', staggerDelay = 0.06 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <span ref={ref} className={`inline ${className}`}>
      {children.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: i * staggerDelay, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: char === ' ' ? 'inline' : 'inline-block', whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

const RevealSlide = ({ children, className = '', delay = 0, from = 'left' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  const x = from === 'left' ? -40 : from === 'right' ? 40 : 0;
  const y = from === 'top' ? -40 : from === 'bottom' ? 40 : 0;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ x, y, opacity: 0 }}
      animate={inView ? { x: 0, y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export { RevealText, RevealStagger, RevealSlide };
