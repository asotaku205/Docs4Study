import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
import { Link } from "wouter";

const BlogCard = React.memo(({ id, image, images, category, date, title, description, author }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  // Featured image logic: prioritize 'image' field, fallback to first image in 'images' array
  const getFeaturedImage = () => {
    // Priority 1: Use 'image' field (main/featured image)
    if (image) {
      if (image.startsWith('http')) return image;
      if (image.startsWith('/uploads')) return `${API_URL}${image}`;
      return image;
    }
    
    // Priority 2: Use first image from 'images' array
    if (images && images.length > 0 && images[0]?.url) {
      const firstImageUrl = images[0].url;
      if (firstImageUrl.startsWith('http')) return firstImageUrl;
      if (firstImageUrl.startsWith('/uploads')) return `${API_URL}${firstImageUrl}`;
      return firstImageUrl;
    }
    
    // Priority 3: Fallback to default placeholder
    return '/library.png';
  };

  return (
    <Link href={`/blog-detail/${id}`}>
      <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden border-border hover:shadow-lg transition-all duration-300 group cursor-pointer">
        <div className="overflow-hidden">
          <img
            src={getFeaturedImage()}
            alt={title}
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4 gap-2 justify-between">
            <div className="text-sm text-secondary-foreground font-medium border rounded-md bg-secondary px-2 py-1 border-primary/20">
              {category}
            </div>
            <span className="text-sm text-muted-foreground">{date}</span>
          </div>
          <h3 className="text-lg text-primary font-bold mb-2 line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{description || 'No description available'}</p>
        </div>

        <div className="flex items-center p-6 border-t border-border pt-4">
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faUserPen} />
            {author}
          </span>
        </div>
      </div>
    </Link>
  );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;
