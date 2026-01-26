import { useState, useEffect } from 'react';


export const useTabs = (defaultTab) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return {
    activeTab,
    handleTabChange
  };
};
