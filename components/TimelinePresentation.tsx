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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - touchEndY;
    const deltaX = touchStartX.current - touchEndX;

    // Check if user is scrolling within the text container
    if (scrollContainerRef.current) {
      const isScrollable = scrollContainerRef.current.scrollHeight > scrollContainerRef.current.clientHeight;
      const isAtTop = scrollContainerRef.current.scrollTop === 0;
      const isAtBottom = scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight >= scrollContainerRef.current.scrollHeight - 5;

      // If content is scrollable and user is not at the edge, don't navigate
      if (isScrollable && !isAtTop && !isAtBottom) {
        return;
      }

      // If scrollable and swiping in the direction away from edge, don't navigate
      if (isScrollable && !isAtTop && deltaY > 0) {
        // Trying to scroll down but not at bottom
        return;
      }
      if (isScrollable && !isAtBottom && deltaY < 0) {
        // Trying to scroll up but not at top
        return;
      }
    }

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
    // Reset image loaded state when slide changes
    setImageLoaded(false);
  }, [currentSlide]);

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
            <>
              {/* Loading skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 animate-pulse" />
              )}
              {/* Actual image */}
              <img
                src={slide.image}
                alt={`Slide ${currentSlide + 1}`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isTransitioning ? "opacity-50" : "opacity-100"
                } ${slide.quiz ? "blur-sm" : ""} ${
                  !imageLoaded ? "opacity-0" : "opacity-100"
                }`}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <p className="text-gray-400 text-lg">No image</p>
            </div>
          )}
        </div>

        {/* Overlay Gradient */}
        <div className={`absolute inset-0 ${
          slide.quiz 
            ? "bg-gradient-to-t from-black/80 via-black/40 to-black/20" 
            : "bg-gradient-to-t from-black via-transparent to-transparent"
        }`} />

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
              <div ref={scrollContainerRef} className="w-full max-h-64 overflow-y-auto px-6 flex flex-col items-center">
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
