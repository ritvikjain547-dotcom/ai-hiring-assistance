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
  return (
    <div className={`avatar avatar-${size}`}>
      {fallbackInitial}
    </div>
  );
}
