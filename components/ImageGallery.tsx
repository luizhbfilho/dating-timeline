"use client";

import { Trash2, ZoomIn } from "lucide-react";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  onRemoveImage: (index: number) => void;
}

export default function ImageGallery({
  images,
  onRemoveImage,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="inline-block p-8 bg-white rounded-2xl shadow-md border-2 border-dashed border-rose-200">
          <p className="text-gray-500 text-lg mb-2">No photos yet</p>
          <p className="text-gray-400 text-sm">
            Add photos to create your memory collection
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-square bg-gray-200">
              <img
                src={image}
                alt={`Memory ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => setSelectedImage(index)}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                aria-label="View image"
              >
                <ZoomIn className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={() => onRemoveImage(index)}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                aria-label="Delete image"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Image Number Badge */}
            <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage]}
              alt="Full view"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
