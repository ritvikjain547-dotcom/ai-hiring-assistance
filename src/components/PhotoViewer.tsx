'use client';

import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

interface PhotoViewerProps {
  src: string;
  alt: string;
  fallbackInitial: string;
  size?: "sm" | "md" | "lg";
}

export default function PhotoViewer({ src, alt, fallbackInitial, size = "sm" }: PhotoViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) {
    return (
      <div className={`avatar avatar-${size}`}>
        {fallbackInitial}
      </div>
    );
  }

  return (
    <>
      <div
        className={`avatar avatar-${size} photo-viewer-trigger`}
        style={{ overflow: "hidden", cursor: "pointer", position: "relative" }}
        onClick={() => setIsOpen(true)}
        title="Click to view full photo"
      >
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div className="photo-viewer-zoom-hint">
          <ZoomIn size={12} />
        </div>
      </div>

      {isOpen && (
        <div
          className="photo-viewer-overlay"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="photo-viewer-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="photo-viewer-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close photo viewer"
            >
              <X size={20} />
            </button>
            <img
              src={src}
              alt={alt}
              className="photo-viewer-image"
            />
            <div className="photo-viewer-name">{alt}</div>
          </div>
        </div>
      )}
    </>
  );
}
