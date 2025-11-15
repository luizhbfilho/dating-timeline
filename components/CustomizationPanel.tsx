"use client";

import { Palette, Type } from "lucide-react";

interface CustomizationSettings {
  title: string;
  subtitle: string;
  message: string;
  accentColor: string;
  fontStyle: "elegant" | "modern" | "playful";
}

interface CustomizationPanelProps {
  customization: CustomizationSettings;
  onCustomizationChange: (settings: CustomizationSettings) => void;
}

const accentColors = [
  { name: "Rose", value: "#ff4500" },
  { name: "Pink", value: "#ec4899" },
  { name: "Red", value: "#dc2626" },
  { name: "Purple", value: "#a855f7" },
  { name: "Blue", value: "#3b82f6" },
];

const fontStyles: Array<"elegant" | "modern" | "playful"> = [
  "elegant",
  "modern",
  "playful",
];

export default function CustomizationPanel({
  customization,
  onCustomizationChange,
}: CustomizationPanelProps) {
  const handleChange = (key: keyof CustomizationSettings, value: string) => {
    onCustomizationChange({
      ...customization,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Title Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Main Title
        </label>
        <input
          type="text"
          value={customization.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          placeholder="Enter title"
        />
      </div>

      {/* Subtitle Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Subtitle
        </label>
        <input
          type="text"
          value={customization.subtitle}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          placeholder="Enter subtitle"
        />
      </div>

      {/* Message Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Special Message
        </label>
        <textarea
          value={customization.message}
          onChange={(e) => handleChange("message", e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none"
          placeholder="Write your special message..."
        />
      </div>

      {/* Accent Color Section */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Palette className="w-4 h-4" />
          Accent Color
        </label>
        <div className="grid grid-cols-5 gap-3">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleChange("accentColor", color.value)}
              className={`w-full aspect-square rounded-lg transition-all transform hover:scale-110 ${
                customization.accentColor === color.value
                  ? "ring-4 ring-offset-2 ring-gray-400 scale-110"
                  : "hover:shadow-md"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Font Style Section */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Type className="w-4 h-4" />
          Font Style
        </label>
        <div className="grid grid-cols-3 gap-3">
          {fontStyles.map((style) => (
            <button
              key={style}
              onClick={() => handleChange("fontStyle", style)}
              className={`px-4 py-3 rounded-lg font-semibold transition-all capitalize ${
                customization.fontStyle === style
                  ? "bg-rose-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Preview
        </p>
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
          <p
            className={`text-2xl font-bold mb-2 ${
              customization.fontStyle === "elegant"
                ? "font-serif"
                : "font-sans"
            }`}
            style={{ color: customization.accentColor }}
          >
            {customization.title}
          </p>
          <p className="text-sm text-gray-600">{customization.subtitle}</p>
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
            {customization.message}
          </p>
        </div>
      </div>
    </div>
  );
}
