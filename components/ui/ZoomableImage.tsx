'use client';
import React from 'react';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export default function ZoomableImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  width,
  height,
  fill = false,
  sizes,
  priority = false
}: ZoomableImageProps) {
  return (
    <div className={`relative overflow-hidden group w-full h-full ${containerClassName}`}>
      <Zoom wrapElement="div">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? undefined : 'lazy'}
          className={`cursor-zoom-in transition-transform duration-300 ease-in-out group-hover:scale-[1.02] ${fill ? 'w-full h-full absolute inset-0' : 'max-w-full h-auto'} ${className}`}
          style={{ objectFit: 'contain' }}
        />
      </Zoom>
    </div>
  );
}
