interface PhotoViewerProps {
  src?: string;
  alt?: string;
  fallbackInitial: string;
  size?: "sm" | "md" | "lg";
}

export default function PhotoViewer({ fallbackInitial, size = "sm" }: PhotoViewerProps) {
  return (
    <div className={`avatar avatar-${size}`}>
      {fallbackInitial}
    </div>
  );
}
