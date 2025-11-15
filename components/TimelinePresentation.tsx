"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QuizDisplay from "./QuizDisplay";

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

interface TimelinePresentationProps {
  slides: TimelineSlide[];
  currentSlide: number;
  onSlideChange: (index: number) => void;
  onExit: () => void;
}

export default function TimelinePresentation({
  slides,
  currentSlide,
  onSlideChange,
  onExit,
}: TimelinePresentationProps) {
  const slide = slides[currentSlide];
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - touchEndY;
    const deltaX = touchStartX.current - touchEndX;

    // Swipe up/down threshold
    const threshold = 50;

    // Prioritize vertical swipes
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > threshold) {
        // Swipe up - next slide
        if (currentSlide < slides.length - 1) {
          setIsTransitioning(true);
          setTimeout(() => {
            onSlideChange(currentSlide + 1);
            setIsTransitioning(false);
          }, 150);
        }
      } else if (deltaY < -threshold) {
        // Swipe down - previous slide
        if (currentSlide > 0) {
          setIsTransitioning(true);
          setTimeout(() => {
            onSlideChange(currentSlide - 1);
            setIsTransitioning(false);
          }, 150);
        }
      }
    }
  };


  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentSlide < slides.length - 1) onSlideChange(currentSlide + 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentSlide > 0) onSlideChange(currentSlide - 1);
      } else if (e.key === "Escape") {
        onExit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSlide, slides.length, onSlideChange, onExit]);

  return (
    <main
      id="timeline-presentation"
      className="fixed inset-0 w-screen h-screen bg-black flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full Screen Slide */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full">
        {/* Image - Full Screen */}
        <div className="absolute inset-0 w-full h-full">
          {slide.image ? (
            <img
              src={slide.image}
              alt={`Slide ${currentSlide + 1}`}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isTransitioning ? "opacity-50" : "opacity-100"
              } ${slide.quiz ? "blur-sm" : ""}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
              <span className="text-gray-500 text-lg">No image</span>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className={`absolute inset-0 ${
            slide.quiz 
              ? "bg-gradient-to-t from-black/80 via-black/40 to-black/20" 
              : "bg-gradient-to-t from-black via-transparent to-transparent"
          }`} />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-between p-6 pointer-events-none">
          {/* Top - Exit Button (Always on top) */}
          <div className="relative z-50 flex justify-between items-center w-full pointer-events-auto">
            <div />
            <button
              onClick={onExit}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all active:scale-95 backdrop-blur-sm"
              aria-label="Exit presentation"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom - Content */}
          {slide.quiz ? (
            // Quiz centered on screen
            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-auto">
              <div className="w-full max-w-2xl">
                <QuizDisplay 
                  quiz={slide.quiz}
                />
              </div>
            </div>
          ) : (
            // Phrase at bottom
            <div className="w-full flex flex-col items-center justify-end pb-12 pointer-events-auto">
              <div className="w-full max-h-64 overflow-y-auto px-6 flex flex-col items-center">
                {/* Phrase */}
                <div className="text-center max-w-3xl">
                  <p className="text-2xl sm:text-4xl font-serif text-white leading-relaxed drop-shadow-lg text-center whitespace-pre-wrap">
                    {slide.phrase || ""}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
