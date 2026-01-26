import React from 'react';

const TabButton = ({ 
  active = false, 
  onClick, 
  children,
  variant = 'default'
}) => {
  const variants = {
    default: active 
      ? 'bg-primary text-white shadow-md' 
      : 'bg-card text-muted-foreground hover:bg-accent/80 hover:shadow-sm',
    pill: active
      ? 'bg-secondary text-secondary-foreground shadow-lg scale-105'
      : 'bg-primary/30 text-primary-foreground hover:bg-primary/50 hover:scale-105',
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap 
        transition-all duration-300 ease-out
        hover:shadow-md 
        active:scale-95 active:shadow-sm
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
};

export default TabButton;
