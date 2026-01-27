import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const CategoryFilter = ({ 
  categories = [], 
  activeCategory, 
  onCategoryChange,
  title = "Category" 
}) => {
  return (
    <div className="lg:col-span-1 space-y-8">
      <div>
        <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faFilter} />
          Filters
        </h3>
      </div>

      <div className="space-y-4">
        <div className="border-t pt-4">
          <label className="flex items-center gap-2 text-sm font-semibold mb-4">
            {title}
          </label>
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => onCategoryChange(category._id)}
                className={`text-left text-sm px-3 py-2 rounded-md w-full transition-colors ${
                  activeCategory === category._id
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
