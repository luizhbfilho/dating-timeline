"use client";

import { Heart } from "lucide-react";

interface CustomizationSettings {
  title: string;
  subtitle: string;
  message: string;
  accentColor: string;
  fontStyle: "elegant" | "modern" | "playful";
}

interface AnniversaryCardProps {
  customization: CustomizationSettings;
  imageCount: number;
}

const fontStyles = {
  elegant: "font-serif",
  modern: "font-sans",
  playful: "font-sans",
};

const fontSizeStyles = {
  elegant: "text-4xl",
  modern: "text-3xl",
  playful: "text-3xl",
};

export default function AnniversaryCard({
  customization,
  imageCount,
}: AnniversaryCardProps) {
  return (
    <div
      id="anniversary-card"
      className="relative overflow-hidden rounded-3xl shadow-2xl mb-8"
      style={{
        background: `linear-gradient(135deg, rgba(255, 107, 74, 0.1) 0%, rgba(255, 69, 0, 0.05) 100%)`,
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-rose-200 rounded-full blur-3xl opacity-30 -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-30 -ml-20 -mb-20" />

      {/* Main Content */}
      <div className="relative z-10 px-6 py-12 sm:px-8 sm:py-16 text-center">
        {/* Heart Icon */}
        <div className="flex justify-center mb-6 animate-pulse-slow">
          <Heart
            className="w-12 h-12 sm:w-16 sm:h-16"
            style={{ color: customization.accentColor }}
            fill={customization.accentColor}
          />
        </div>

        {/* Title */}
        <h1
          className={`${fontStyles[customization.fontStyle]} ${fontSizeStyles[customization.fontStyle]} font-bold mb-3 text-gray-800`}
        >
          {customization.title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 mb-6 font-light">
          {customization.subtitle}
        </p>

        {/* Message */}
        <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
          {customization.message}
        </p>

        {/* Image Counter */}
        {imageCount > 0 && (
          <div className="inline-block px-6 py-3 bg-white rounded-full shadow-md">
            <p className="text-sm font-semibold text-gray-700">
              <span style={{ color: customization.accentColor }}>
                {imageCount}
              </span>{" "}
              {imageCount === 1 ? "memory" : "memories"} to cherish
            </p>
          </div>
        )}
      </div>

      {/* Bottom Accent Line */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: customization.accentColor }}
      />
    </div>
  );
}
