import { useRef, useState } from 'react';

const MagneticButton = ({ children, className = '', as = 'button', ...props }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    setStyle({ transform: `translate(${x}px, ${y}px)` });
  };

  const handleMouseLeave = () => {
    setStyle({});
  };

  const Comp = as;

  return (
    <Comp
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transition: 'transform 0.15s ease-out' }}
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default MagneticButton;
