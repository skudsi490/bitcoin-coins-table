import React from 'react';

interface DollarIconProps {
  className?: string; // Define an interface to accept className as a prop
}

const DollarIcon: React.FC<DollarIconProps> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Your SVG content goes here */}
  </svg>
);

export default DollarIcon;
