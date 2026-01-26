import React from "react";
import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from '@fortawesome/free-solid-svg-icons';

const HeroPost = React.memo(({id, image, images, category, date, title, description, author}) => {
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
    <div className="mb-16">
      <Link href={`/blog-detail/${id}`}>
        <div className="w-full grid lg:grid-cols-2 gap-8 items-center bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer">
          <div className="h-full overflow-hidden">
            <img
              src={getFeaturedImage()}
              alt={title}
              className="w-full h-full object-cover rounded-md mb-4"
              loading="lazy"
            />
          </div>
          <div className="p-8 lg:p-12 ">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition text-xs">
                {category}
              </div>
              <span className="text-sm text-muted-foreground">
                {date}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4 line-clamp-2">
              {title}
            </h2>
            <p className="text-muted-foreground mb-6 text-lg line-clamp-3">
              {description || 'Click to read the full story...'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                 <FontAwesomeIcon icon={faUserPen} />
                </div>
                <div>
                  <p className="font-medium text-sm">{author}</p>
                  <p className="text-xs text-muted-foreground">Editor</p>
                </div>
              </div>
              <span className="items-center rounded-md px-4 py-2 font-medium gap-2 justify-center text-sm border border-primary inline-flex whitespace-nowrap">
                Read full story
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

HeroPost.displayName = 'HeroPost';

export default HeroPost;