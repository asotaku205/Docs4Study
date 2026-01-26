import { useMemo } from 'react';

export const useFilter = (items, activeCategory, categoryKey = 'category', allKey = 'All') => {
  const filteredItems = useMemo(() => {
    if (activeCategory === allKey || activeCategory === `${allKey} Post` || activeCategory === `${allKey} Documents`) {
      return items;
    }
    return items.filter(item => item[categoryKey] === activeCategory);
  }, [items, activeCategory, categoryKey, allKey]);

  return filteredItems;
};
