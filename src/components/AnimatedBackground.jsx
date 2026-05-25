import { useRef, useCallback } from 'react';

const AnimatedBackground = () => {
  const bgRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const animate = useCallback(() => {
    const cx = currentRef.current.x + (targetRef.current.x - currentRef.current.x) * 0.1;
    const cy = currentRef.current.y + (targetRef.current.y - currentRef.current.y) * 0.1;
    currentRef.current = { x: cx, y: cy };
    if (bgRef.current) {
      bgRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!bgRef.current) return;
    const rect = bgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 30 - 15;
    const y = ((e.clientY - rect.top) / rect.height) * 30 - 15;
    targetRef.current = { x, y };
  }, []);

  const handleMouseEnter = useCallback(() => {
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={bgRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle at center, #10b981, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle at center, #10b981, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.02]">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#059669" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
};

export default AnimatedBackground;
