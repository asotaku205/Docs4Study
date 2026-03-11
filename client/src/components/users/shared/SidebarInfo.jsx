import React from "react";

const SidebarInfo = ({ 
  title, 
  items = [], 
  children,
  className = ""
}) => {
  return (
    <div className={`rounded-xl border bg-card text-card-foreground sticky top-20 shadow-xl ${className}`}>
      <div className="p-6">
        <div className="border-b border-border">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            {title}
          </h3>
        </div>
        
        {children || (
          <div className="space-y-3 mt-4 text-sm">
            {items.map((item, index) => (
              <div key={index}>
                <p className="text-muted-foreground">{item.label}</p>
                <p className="font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarInfo;
