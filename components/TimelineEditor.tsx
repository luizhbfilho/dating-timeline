"use client";

import { Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import QuizEditor from "./QuizEditor";

interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Quiz {
  question: string;
  answers: QuizAnswer[];
}

interface TimelineSlide {
  id: string;
  image: string;
  phrase: string;
  quiz?: Quiz;
}

interface TimelineEditorProps {
  slides: TimelineSlide[];
  onUpdateSlide: (id: string, updates: Partial<TimelineSlide>) => void;
  onDeleteSlide: (id: string) => void;
}

export default function TimelineEditor({
  slides,
  onUpdateSlide,
  onDeleteSlide,
}: TimelineEditorProps) {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleImageUpload = (slideId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUpdateSlide(slideId, { image: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  if (slides.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="inline-block p-8 bg-gray-800 rounded-2xl shadow-md border-2 border-dashed border-rose-900/30">
          <p className="text-gray-400 text-lg mb-2">No slides yet</p>
          <p className="text-gray-500 text-sm">
            Click &quot;Add Slide&quot; to create your first timeline slide
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Slide Header */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-200">
                Slide {index + 1}
              </p>
              <p className="text-xs text-gray-400">
                {slide.image ? "✓ Image added" : "No image"}
              </p>
            </div>
            <button
              onClick={() => onDeleteSlide(slide.id)}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              aria-label="Delete slide"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Content */}
          <div className="p-6 space-y-4">
            {/* Image Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Photo
              </label>
              <div className="flex gap-4">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={`Slide ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <button
                    onClick={() => fileInputRefs.current[slide.id]?.click()}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {slide.image ? "Change Photo" : "Add Photo"}
                  </button>
                  <input
                    ref={(el) => {
                      if (el) fileInputRefs.current[slide.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      if (file) {
                        handleImageUpload(slide.id, file);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Phrase Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Phrase or Caption
              </label>
              <textarea
                value={slide.phrase}
                onChange={(e) =>
                  onUpdateSlide(slide.id, { phrase: e.target.value })
                }
                placeholder="Add a meaningful phrase, memory, or caption..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none placeholder-gray-500"
                maxLength={200}
              />
              <p className="text-xs text-gray-400 mt-1">
                {slide.phrase.length}/200 characters
              </p>
            </div>

            {/* Quiz Section */}
            <QuizEditor
              quiz={slide.quiz}
              onUpdateQuiz={(quiz) =>
                onUpdateSlide(slide.id, { quiz })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
