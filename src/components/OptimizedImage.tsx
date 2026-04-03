import { useState } from 'react';
import { motion } from 'framer-motion';

export interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  src: string;
  alt: string;
  avifSrc?: string;
  webpSrc?: string;
  mobileSrc?: string;
  blurSrc?: string; // Tiny placeholder image
  className?: string; // Styles for the outer wrapper container
  imageClassName?: string; // Styles for the actual image
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean; // If true, disables lazy loading for above-the-fold
}

/**
 * OptimizedImage Component
 * Premium Awwwards-style image reveal with:
 * - Next.js style blur-up technique
 * - Multi-format <picture> fallback (AVIF -> WebP -> original)
 * - Native lazy loading (unless priority=true)
 * - Smooth Framer Motion scale & fade on load
 */
export default function OptimizedImage({
  src,
  alt,
  avifSrc,
  webpSrc,
  mobileSrc,
  blurSrc,
  className = '',
  imageClassName = '',
  objectFit = 'cover',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden bg-black/5 dark:bg-white/5 ${className}`}
    >
      {/* Blurred Placeholder Indicator */}
      {blurSrc && !isLoaded && (
        <img
          src={blurSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 z-0"
        />
      )}

      {/* Actual Responsive Image */}
      <picture>
        {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        {mobileSrc && <source media="(max-width: 768px)" srcSet={mobileSrc} />}
        
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0, 
            scale: isLoaded ? 1 : 1.05 
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.33, 1, 0.68, 1] // Custom refined spring-like ease Out
          }}
          className={`relative z-10 w-full h-full ${
            objectFit === 'cover' ? 'object-cover' :
            objectFit === 'contain' ? 'object-contain' : ''
          } ${imageClassName}`}
          {...props}
        />
      </picture>
    </div>
  );
}
