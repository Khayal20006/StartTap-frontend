const GradientText = ({ children, className = '', as: Tag = 'span' }) => (
  <Tag className={`bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent ${className}`}>
    {children}
  </Tag>
);

export default GradientText;
