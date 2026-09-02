'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';

interface GalleryImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  const isSingle = images.length === 1;

  return (
    <Gallery>
      <div 
        className={`w-full ${isSingle ? 'max-w-3xl mx-auto' : 'grid gap-6'}`}
        style={!isSingle ? { gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' } : {}}
      >
        {images.map((img, index) => (
          <Item
            key={index}
            original={img.src}
            thumbnail={img.src}
            width={img.width || 1920}
            height={img.height || 1080}
            alt={img.alt || `Gallery image ${index + 1}`}
          >
            {({ ref, open }) => (
              <Thumbnail 
                image={img} 
                innerRef={ref as React.Ref<HTMLImageElement>} 
                open={open} 
              />
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  );
}

interface ThumbnailProps {
  image: GalleryImage;
  innerRef: React.Ref<HTMLImageElement>;
  open: (e: React.MouseEvent) => void;
}

function Thumbnail({ image, innerRef, open }: ThumbnailProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className="relative w-full aspect-[4/3] bg-surface rounded-lg overflow-hidden cursor-zoom-in group transition-all duration-300 ease-in-out hover:shadow-xl border border-border"
      onClick={open}
    >
      {/* Skeleton Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-background/50 animate-pulse flex items-center justify-center z-0">
          <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
        </div>
      )}
      
      <img
        ref={innerRef}
        src={image.src}
        alt={image.alt || 'Gallery image'}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-contain p-2 transition-all duration-300 ease-in-out group-hover:scale-[1.02] ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
